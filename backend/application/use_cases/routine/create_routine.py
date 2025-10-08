import json
from fastapi import Depends
from application.use_cases.workout.create_workout import CreateWorkoutUseCase
from domain.repositories.routine_repository import RoutineRepository
from infrastructure.services.ai_api import call_gemini
from infrastructure.services.weather_api import fetch_weather
from scremas.routine_schema import RoutineCreate
from scremas.workout_schema import WorkoutCreate


class CreateRoutineUseCase:
    def __init__(self,
                 repository: RoutineRepository = Depends()):
        self.repository = repository

    def execute(self, data: RoutineCreate, create_workout_use_case: CreateWorkoutUseCase):
        routine = self.repository.create(data.routine.model_dump())
        # return RoutineResponse.model_validate(routine)

        location = data.location

        weather_json = fetch_weather(location.latitude, location.longitude)
        payload_json = call_gemini(data.profile.model_dump(), f"Generate a plan to workout based on these info for the next 7 days: weather {weather_json}")
        workouts = json.loads(payload_json)

        for workout in workouts:
            workout['routine_id'] = routine.id
            workout_schema = WorkoutCreate(**workout)
            create_workout_use_case.execute(workout_schema)

