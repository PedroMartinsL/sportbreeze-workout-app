import pytest
import json
from unittest.mock import MagicMock, patch
from fastapi import HTTPException

from application.use_cases.routine.create_routine import CreateRoutineUseCase
from application.use_cases.workout.create_workout import CreateWorkoutUseCase
from schemas.routine_schema import RoutineCreate, RoutineBase, LocationSchema, ProfileSchema
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

@pytest.fixture
def mock_gemini_weather():
    """Fixture que cria mocks de Gemini e Weather prontos pra uso."""
    with patch("application.use_cases.routine.create_routine.fetch_weather") as mock_weather, \
         patch("application.use_cases.routine.create_routine.call_gemini") as mock_gemini:

        mock_weather.return_value = {"weather": "Sunny", "temp": 25}
        mock_gemini.return_value = json.dumps([
            {
                "weather": "Sunny",
                "kcal": 200,
                "title": "Run",
                "temp": 25.5,
                "duration": 45,
                "planner": "AI Plan",
                "hour": "08:00",
                "date": "2025-10-13",
                "sport": "Running"
            }
        ])

        yield mock_weather, mock_gemini

def test_create_routine_success(fake_routine_data, fake_repo, fake_workout_use_case, mock_gemini_weather):
    """Successful case: creates a full routine using weather data and AI."""
    mock_fetch_weather, mock_call_gemini = mock_gemini_weather

    use_case = CreateRoutineUseCase(repository=fake_repo)
    result = use_case.execute(fake_routine_data, fake_workout_use_case)

    assert result.id == 1
    mock_fetch_weather.assert_called_once()
    mock_call_gemini.assert_called_once()
    assert fake_workout_use_case.execute.call_count == 1


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
    assert exc.value.detail == "Empty or invalid JSON from Gemini API"


@patch("infrastructure.services.ai_api.get_client")
def test_call_gemini(mock_get_client):
    """Unit test for Gemini API call simulation."""
    mock_client = MagicMock()
    mock_client.models.generate_content.return_value.text = '{"weather": "SUNNY"}'
    mock_get_client.return_value = mock_client

    result = call_gemini({"age": 25}, "prompt")
    assert "SUNNY" in result


def test_execute_raises_if_location_missing(fake_routine_data):
    data = fake_routine_data
    data.location = None  # Simula campo vazio
    use_case = CreateRoutineUseCase(repository=MagicMock())
    create_workout_use_case = MagicMock()

    with pytest.raises(HTTPException) as exc:
        use_case.execute(data, create_workout_use_case)

    assert exc.value.status_code == 400
    assert "Location not provided" in exc.value.detail


def test_execute_raises_if_routine_missing(fake_routine_data):
    data = fake_routine_data
    data.routine = None
    use_case = CreateRoutineUseCase(repository=MagicMock())
    create_workout_use_case = MagicMock()

    with pytest.raises(HTTPException) as exc:
        use_case.execute(data, create_workout_use_case)

    assert exc.value.status_code == 400
    assert "Routine not provided" in exc.value.detail


def test_execute_raises_if_profile_missing(fake_routine_data):
    data = fake_routine_data
    data.profile = None
    use_case = CreateRoutineUseCase(repository=MagicMock())
    create_workout_use_case = MagicMock()

    with pytest.raises(HTTPException) as exc:
        use_case.execute(data, create_workout_use_case)

    assert exc.value.status_code == 400
    assert "Profile not provided" in exc.value.detail

def test_execute_continues_on_workout_exception(fake_routine_data, mock_gemini_weather):
    mock_fetch_weather, mock_call_gemini = mock_gemini_weather

    routine_repo = MagicMock()
    routine_repo.create.return_value.id = 1
    use_case = CreateRoutineUseCase(repository=routine_repo)

    create_workout_use_case = MagicMock()
    create_workout_use_case.execute.side_effect = Exception("Forced error")

    result = use_case.execute(fake_routine_data, create_workout_use_case)

    routine_repo.create.assert_called_once()
    create_workout_use_case.execute.assert_called_once()
