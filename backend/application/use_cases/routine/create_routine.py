from fastapi import Depends
from application.use_cases.workout.create_workout import CreateWorkoutUseCase
from domain.repositories.routine_repository import RoutineRepository
from infrastructure.services.ai_api import build_gemini_payload
from infrastructure.services.weather_api import fetch_weather
from scremas.routine_schema import RoutineCreate, RoutineResponse


class CreateRoutineUseCase:
    def __init__(self,
                 repository: RoutineRepository = Depends()):
        self.repository = repository

    def execute(self, data: RoutineCreate):
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

        weather_json = fetch_weather()
        payload_json = build_gemini_payload(profile, f"Generate a plain to workout based on these info for the next 7 days: weather {weather_json}")

        for workout in payload_json:
            use_case = CreateWorkoutUseCase()
            use_case.execute(**workout)

