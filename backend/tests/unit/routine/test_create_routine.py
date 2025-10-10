# # backend/tests/unit/routine/test_create_routine_usecase.py
# import pytest
# from unittest.mock import MagicMock, patch
# from fastapi import HTTPException
# import json

# from application.use_cases.routine.create_routine import CreateRoutineUseCase
# from application.use_cases.workout.create_workout import CreateWorkoutUseCase
# from schemas.routine_schema import RoutineCreate
# from schemas.workout_schema import WorkoutCreate

# # Fixtures
# @pytest.fixture
# def fake_routine_data():
#     class Location:
#         latitude = 10.0
#         longitude = 20.0

#     class Profile:
#         def model_dump(self):
#             return {"age": 25, "level": "beginner"}

#     class Routine:
#         def model_dump(self):
#             return {"name": "Routine 1"}

#     return RoutineCreate(
#         routine=Routine(),
#         location=Location(),
#         profile=Profile()
#     )

# @pytest.fixture
# def fake_repo():
#     repo = MagicMock()
#     # Retorna um objeto com id
#     repo.create.return_value.id = 1
#     return repo

# @pytest.fixture
# def fake_workout_use_case():
#     return MagicMock(spec=CreateWorkoutUseCase)


# # -------------------------------
# # Teste unitário de CreateRoutineUseCase
# # -------------------------------
# @patch("application.use_cases.routine.create_routine.fetch_weather")
# @patch("application.use_cases.routine.create_routine.call_gemini")
# def test_create_routine_success(mock_call_gemini, mock_fetch_weather, fake_routine_data, fake_repo, fake_workout_use_case):
#     # Simula retorno do clima
#     mock_fetch_weather.return_value = {"temp": 25, "condition": "sunny"}
    
#     # Simula retorno do Gemini
#     workouts_json = [
#         {"name": "Push-ups", "reps": 10},
#         {"name": "Sit-ups", "reps": 15},
#     ]
#     mock_call_gemini.return_value = json.dumps(workouts_json)

#     use_case = CreateRoutineUseCase(repository=fake_repo)
    
#     result = use_case.execute(fake_routine_data, fake_workout_use_case)

#     # Valida retorno da rotina
#     assert result.id == 1
    
#     # Valida chamadas do fetch_weather e call_gemini
#     mock_fetch_weather.assert_called_once_with(fake_routine_data.location.latitude, fake_routine_data.location.longitude)
#     mock_call_gemini.assert_called_once()
    
#     # Valida criação dos workouts
#     assert fake_workout_use_case.execute.call_count == len(workouts_json)
#     for call_args, workout in zip(fake_workout_use_case.execute.call_args_list, workouts_json):
#         workout_schema_passed = call_args[0][0]
#         assert isinstance(workout_schema_passed, WorkoutCreate)
#         assert workout_schema_passed.name == workout["name"]
#         assert workout_schema_passed.reps == workout["reps"]
#         assert workout_schema_passed.routine_id == result.id


# # -------------------------------
# # Teste falha: clima não encontrado
# # -------------------------------
# @patch("application.use_cases.routine.create_routine.fetch_weather")
# def test_create_routine_weather_fail(mock_fetch_weather, fake_routine_data, fake_repo, fake_workout_use_case):
#     mock_fetch_weather.return_value = None
#     use_case = CreateRoutineUseCase(repository=fake_repo)

#     with pytest.raises(HTTPException) as exc:
#         use_case.execute(fake_routine_data, fake_workout_use_case)
#     assert exc.value.status_code == 404
#     assert exc.value.detail == "Weather information not found"


# # -------------------------------
# # Teste falha: Gemini retorna JSON inválido
# # -------------------------------
# @patch("application.use_cases.routine.create_routine.fetch_weather")
# @patch("application.use_cases.routine.create_routine.call_gemini")
# def test_create_routine_gemini_invalid_json(mock_call_gemini, mock_fetch_weather, fake_routine_data, fake_repo, fake_workout_use_case):
#     mock_fetch_weather.return_value = {"temp": 25, "condition": "sunny"}
#     mock_call_gemini.return_value = "invalid json"

#     use_case = CreateRoutineUseCase(repository=fake_repo)

#     with pytest.raises(HTTPException) as exc:
#         use_case.execute(fake_routine_data, fake_workout_use_case)
#     assert exc.value.status_code == 500
#     assert exc.value.detail == "Invalid JSON from Gemini API"
