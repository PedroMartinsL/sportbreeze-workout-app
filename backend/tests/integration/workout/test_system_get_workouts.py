# import pytest
# from fastapi.testclient import TestClient
# from unittest.mock import MagicMock
# from main import app


# # ----------------------------------------------------------------------
# # FIXTURE: TestClient
# # ----------------------------------------------------------------------
# @pytest.fixture
# def client():
#     return TestClient(app)


# # ----------------------------------------------------------------------
# # FIXTURE: mock de verify_token (autenticação)
# # ----------------------------------------------------------------------
# @pytest.fixture
# def mock_verify_token(monkeypatch):
#     """Mocka o verify_token para sempre retornar um user fake."""
#     def fake_verify():
#         return MagicMock(id=100)  # user_id fake
#     monkeypatch.setattr(
#         "application.routes.workout.verify_token",
#         lambda: fake_verify()
#     )


# # ----------------------------------------------------------------------
# # FIXTURE: mock do caso de uso
# # ----------------------------------------------------------------------
# @pytest.fixture
# def mock_use_case(monkeypatch):
#     """Mocka FindWorkoutsByRoutineUseCase para testes de sistema."""
#     mock = MagicMock()
#     monkeypatch.setattr(
#         "application.routes.workout.FindWorkoutsByRoutineUseCase",
#         lambda: mock
#     )
#     return mock


# # ----------------------------------------------------------------------
# # TESTE 1 — Sucesso
# # ----------------------------------------------------------------------
# def test_system_get_workouts_success(client, mock_use_case, mock_verify_token):
#     mock_use_case.execute.return_value = [
#         {
#             "id": 1,
#             "routine_id": 10,
#             "name": "Supino",
#             "series": 4,
#             "repetitions": 10
#         },
#         {
#             "id": 2,
#             "routine_id": 10,
#             "name": "Agachamento",
#             "series": 3,
#             "repetitions": 12
#         }
#     ]

#     response = client.get("/workouts/10")

#     assert response.status_code == 200
#     data = response.json()

#     assert len(data) == 2
#     assert data[0]["name"] == "Supino"

#     mock_use_case.execute.assert_called_once_with(10)


# # ----------------------------------------------------------------------
# # TESTE 2 — Nenhum workout encontrado → 404
# # ----------------------------------------------------------------------
# def test_system_get_workouts_not_found(client, mock_use_case, mock_verify_token):
#     mock_use_case.execute.return_value = None  # simula ausência

#     response = client.get("/workouts/10")

#     assert response.status_code == 404
#     assert response.json()["detail"] == "User workouts not found"


# # ----------------------------------------------------------------------
# # TESTE 3 — routine_id inválido no caso de uso
# # ----------------------------------------------------------------------
# def test_system_get_workouts_invalid_routine(client, mock_use_case, mock_verify_token):
#     from fastapi import HTTPException

#     mock_use_case.execute.side_effect = HTTPException(
#         status_code=404,
#         detail="Routine not found"
#     )

#     response = client.get("/workouts/0")

#     assert response.status_code == 404
#     assert response.json()["detail"] == "Routine not found"
