import json
from fastapi import Depends, HTTPException
from application.use_cases.workout.create_workout import CreateWorkoutUseCase
from domain.repositories.routine_repository import RoutineRepository
from infrastructure.services.ai_api import call_gemini
from infrastructure.services.weather_api import fetch_weather
from schemas.routine_schema import RoutineCreate
from schemas.workout_schema import WorkoutCreate


class CreateRoutineUseCase:
    def __init__(self,
                 repository: RoutineRepository = Depends()):
        self.repository = repository

    def execute(self, data: RoutineCreate, create_workout_use_case: CreateWorkoutUseCase):
        
        if not data.location:
            raise HTTPException(status_code=400, detail="Location not provided")
        
        if not data.routine:
            raise HTTPException(status_code=400, detail="Routine not provided")
        
        if not data.profile:
            raise HTTPException(status_code=400, detail="Profile not provided")

        routine = self.repository.create(data.routine.model_dump())
        location = data.location

        # Busca informações do clima
        weather_json = fetch_weather(location.latitude, location.longitude)
        if not weather_json:
            raise HTTPException(status_code=404, detail="Weather information not found")

        # Chamada ao Gemini AI
        payload_json = call_gemini(
            data.profile.model_dump(),
            f"Generate a plan to workout based on these info for the next 7 days: weather {weather_json}"
        )

        try:
            workouts = json.loads(payload_json)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Empty or invalid JSON from Gemini API")

        for workout in workouts:
            workout['routine_id'] = routine.id
            workout_schema = WorkoutCreate(**workout)
            try:
                create_workout_use_case.execute(workout_schema)
            except Exception as e:
                # Log do erro e continua com os próximos workouts
                continue

        return routine

