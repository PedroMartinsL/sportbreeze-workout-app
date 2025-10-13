import pytest
import json
from unittest.mock import MagicMock, patch
from fastapi import HTTPException

from application.use_cases.routine.create_routine import CreateRoutineUseCase
from application.use_cases.workout.create_workout import CreateWorkoutUseCase
from schemas.routine_schema import RoutineCreate, RoutineBase, LocationSchema, ProfileSchema
from schemas.workout_schema import WorkoutCreate
from infrastructure.services.ai_api import call_gemini


@pytest.fixture
def fake_routine_data():
    """Returns mock data for routine creation."""
    return RoutineCreate(
        routine=RoutineBase(name="Routine 1", user_id=1),
        location=LocationSchema(latitude=10.0, longitude=20.0),
        profile=ProfileSchema()
    )


@pytest.fixture
def fake_repo():
    """Returns a fake repository simulating persistence."""
    repo = MagicMock()
    repo.create.return_value.id = 1
    return repo


@pytest.fixture
def fake_workout_use_case():
    """Returns a fake use case for workout creation."""
    use_case = MagicMock(spec=CreateWorkoutUseCase)
    use_case.execute.side_effect = lambda workout: workout
    return use_case


@patch("application.use_cases.routine.create_routine.call_gemini")
@patch("application.use_cases.routine.create_routine.fetch_weather")
def test_create_routine_success(mock_fetch_weather, mock_call_gemini,
                                fake_routine_data, fake_repo, fake_workout_use_case):
    """Successful case: creates a full routine using weather data and AI."""
    mock_fetch_weather.return_value = {"temp": 25, "condition": "SUNNY"}

    workouts_json = [
        {
            "weather": "SUNNY",
            "kcal": 200,
            "title": "Morning Run",
            "temp": 25.0,
            "duration": 30,
            "planner": "John",
            "hour": "07:00",
            "date": "2025-10-11",
            "sport": "RUNNING",
            "routine_id": 1
        },
        {
            "weather": "CLOUDY",
            "kcal": 250,
            "title": "Evening Yoga",
            "temp": 23.0,
            "duration": 45,
            "planner": "John",
            "hour": "18:00",
            "date": "2025-10-11",
            "sport": "YOGA",
            "routine_id": 1
        }
    ]
    mock_call_gemini.return_value = json.dumps(workouts_json)

    use_case = CreateRoutineUseCase(repository=fake_repo)
    result = use_case.execute(fake_routine_data, fake_workout_use_case)

    assert result.id == 1
    mock_fetch_weather.assert_called_once_with(
        fake_routine_data.location.latitude,
        fake_routine_data.location.longitude
    )
    mock_call_gemini.assert_called_once()

    assert fake_workout_use_case.execute.call_count == len(workouts_json)
    for call_args in fake_workout_use_case.execute.call_args_list:
        workout_passed = call_args[0][0]
        assert isinstance(workout_passed, WorkoutCreate)


@patch("application.use_cases.routine.create_routine.fetch_weather")
def test_create_routine_weather_fail(mock_fetch_weather, fake_routine_data, fake_repo, fake_workout_use_case):
    """Failure case: weather data not found."""
    mock_fetch_weather.return_value = None
    use_case = CreateRoutineUseCase(repository=fake_repo)
    with pytest.raises(HTTPException) as exc:
        use_case.execute(fake_routine_data, fake_workout_use_case)
    assert exc.value.status_code == 404
    assert exc.value.detail == "Weather information not found"


@patch("application.use_cases.routine.create_routine.fetch_weather")
@patch("application.use_cases.routine.create_routine.call_gemini")
def test_create_routine_gemini_invalid_json(mock_call_gemini, mock_fetch_weather, fake_routine_data, fake_repo, fake_workout_use_case):
    """Failure case: Gemini returns invalid JSON."""
    mock_fetch_weather.return_value = {"temp": 25, "condition": "sunny"}
    mock_call_gemini.return_value = "invalid json"
    use_case = CreateRoutineUseCase(repository=fake_repo)
    with pytest.raises(HTTPException) as exc:
        use_case.execute(fake_routine_data, fake_workout_use_case)
    assert exc.value.status_code == 500
    assert exc.value.detail == "Invalid JSON from Gemini API"


@patch("infrastructure.services.ai_api.get_client")
def test_call_gemini(mock_get_client):
    """Unit test for Gemini API call simulation."""
    mock_client = MagicMock()
    mock_client.models.generate_content.return_value.text = '{"weather": "SUNNY"}'
    mock_get_client.return_value = mock_client

    result = call_gemini({"age": 25}, "prompt")
    assert "SUNNY" in result
