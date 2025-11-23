# tests/integration/workout/test_system_get_workouts.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from datetime import date, time
from main import app
from domain.entities.user import User
from api.controllers.workout_controller import verify_token, FindWorkoutsByRoutineUseCase

@pytest.fixture
def client():
    # Mock do usuário logado
    fake_user = User(id=1, email="test@example.com", username="Test User")
    app.dependency_overrides[verify_token] = lambda: fake_user
    return TestClient(app)

@pytest.fixture
def mock_use_case():
    return MagicMock(spec=FindWorkoutsByRoutineUseCase)

def test_system_get_workouts_success(client, mock_use_case):
    # Substitui a dependência do use case pelo mock
    app.dependency_overrides[FindWorkoutsByRoutineUseCase] = lambda: mock_use_case

    mock_use_case.execute.return_value = [
        {
            "id": 1,
            "routine_id": 10,
            "weather": "Sunny",
            "kcal": 300.0,
            "title": "Treino de Peito",
            "temp": 25.0,
            "duration": 60,
            "planner": "Coach",
            "hour": time(10, 0),
            "date": date(2025, 11, 22),
            "sport": "Gym",
            "check": False,
            "notify": True
        },
        {
            "id": 2,
            "routine_id": 10,
            "weather": "Sunny",
            "kcal": 250.0,
            "title": "Treino de Pernas",
            "temp": 25.0,
            "duration": 50,
            "planner": "Coach",
            "hour": time(11, 0),
            "date": date(2025, 11, 22),
            "sport": "Gym",
            "check": False,
            "notify": True
        }
    ]

    response = client.get("/workouts/10")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["title"] == "Treino de Peito"

def test_system_get_workouts_not_found(client, mock_use_case):
    app.dependency_overrides[FindWorkoutsByRoutineUseCase] = lambda: mock_use_case
    mock_use_case.execute.return_value = None

    response = client.get("/workouts/10")
    assert response.status_code == 404
    assert response.json()["detail"] == "User workouts not found"

def test_system_get_workouts_invalid_routine(client, mock_use_case):
    app.dependency_overrides[FindWorkoutsByRoutineUseCase] = lambda: mock_use_case
    from fastapi import HTTPException
    mock_use_case.execute.side_effect = HTTPException(status_code=404, detail="Routine not found")

    response = client.get("/workouts/0")
    assert response.status_code == 404
    assert response.json()["detail"] == "Routine not found"
