# tests/integration/workout/test_system_delete_workout.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from main import app
from domain.entities.user import User
from api.controllers.workout_controller import DeleteWorkoutUseCase, verify_token
from domain.entities.workout import Workout

@pytest.fixture
def client():
    fake_user = User(id=1, email="test@example.com", username="Test User")
    app.dependency_overrides[verify_token] = lambda: fake_user
    return TestClient(app)

@pytest.fixture
def mock_use_case():
    return MagicMock(spec=DeleteWorkoutUseCase)

def test_delete_workout_success(client, mock_use_case):
    app.dependency_overrides[DeleteWorkoutUseCase] = lambda: mock_use_case

    fake_workout = {
        "id": 1,
        "routine_id": 10,
        "weather": "Sunny",
        "kcal": 300,
        "title": "Treino de Peito",
        "temp": 25,
        "duration": 60,
        "planner": "Coach",
        "hour": "10:00",
        "date": "2025-11-22",
        "sport": "Gym",
        "check": False,
        "notify": True,
        "routine_id": 10
    }
    mock_use_case.execute.return_value = fake_workout

    response = client.delete("/workouts/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["title"] == "Treino de Peito"

def test_delete_workout_not_found(client, mock_use_case):
    app.dependency_overrides[DeleteWorkoutUseCase] = lambda: mock_use_case
    mock_use_case.execute.return_value = None

    response = client.delete("/workouts/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "User workout not found"
