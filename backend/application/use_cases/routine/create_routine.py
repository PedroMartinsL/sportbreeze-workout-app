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
        routine = self.repository.create(data.model_dump())
        # return RoutineResponse.model_validate(routine)

        profile = {
            "esportes_praticados": ["natação", "corrida"],
            "peso": 75,
            "idade": 28,
            "altura": 1.75,
            "frequencia": "3x por semana",
            "usa_drogas": False,
            "disponibilidade": "todos os finais de semana as 15h e 18h"
        }

        gps = {
            "lat": -23.5505,
            "lon": -46.6333
        }

        # weather_json = fetch_weather(**gps)
        # payload_json = call_gemini(profile, f"Generate a plan to workout based on these info for the next 7 days: weather {weather_json}")
        payload_json = call_gemini(profile, f"Generate a plan")
        workouts = json.loads(payload_json)

        for workout in workouts:
            workout['routine_id'] = routine.id
            workout_schema = WorkoutCreate(**workout)
            create_workout_use_case.execute(workout_schema)

