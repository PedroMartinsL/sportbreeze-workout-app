from datetime import datetime, timedelta
from fastapi import HTTPException
from application.use_cases.workout.create_workout import CreateWorkoutUseCase
from schemas.workout_schema import WorkoutCreate
import pytest
from unittest.mock import MagicMock


@pytest.fixture
def fake_repo():
    """Provides a mock repository that returns a sample workout when created."""
    repo = MagicMock()
    repo.create.return_value = {
        "weather": "Sunny",
        "kcal": 300,
        "title": "Running",
        "temp": 25.0,
        "duration": 60,
        "planner": "John",
        "hour": "10:00",
        "date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
        "sport": "Running",
        "routine_id": 1
    }
    return repo


def test_create_workout_success(fake_repo):
    """Should successfully create a new workout if there is no conflict and the date is in the future."""
    use_case = CreateWorkoutUseCase(repository=fake_repo)
    use_case.find_workouts_by_routine_use_case = MagicMock(return_value=[])

    new_workout = WorkoutCreate(
        weather="Cloudy",
        kcal=300,
        title="Morning Run",
        temp=20.0,
        duration=60,
        planner="John",
        hour = (datetime.now() + timedelta(hours=1)).time(),
        date = (datetime.now() + timedelta(days=1)).date(),
        sport="Running",
        routine_id=1
    )

    result = use_case.execute(new_workout)

    assert result["title"] == "Running"
    fake_repo.create.assert_called_once_with(new_workout)


def test_create_workout_with_past_date(fake_repo):
    """Should raise HTTP 400 if the workout date and time are in the past."""
    use_case = CreateWorkoutUseCase(repository=fake_repo)
    use_case.find_workouts_by_routine_use_case = MagicMock(return_value=[])

    past_workout = WorkoutCreate(
        weather="Rainy",
        kcal=200,
        title="Past Run",
        temp=18.0,
        duration=45,
        planner="John",
        hour=(datetime.now() - timedelta(hours=1)).strftime("%H:%M"),
        date=(datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
        sport="Running",
        routine_id=1
    )

    with pytest.raises(HTTPException) as exc_info:
        use_case.execute(past_workout)

    assert exc_info.value.status_code == 400
    assert "A data e hora do treino não podem estar no passado" in exc_info.value.detail


def test_create_workout_conflict(fake_repo):
    """Should raise an exception if the workout conflicts with an existing workout time."""
    existing_workout = WorkoutCreate(
        weather="Sunny",
        kcal=300,
        title="Existing Run",
        temp=25.0,
        duration=60,
        planner="John",
        hour="10:00",
        date=(datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
        sport="Running",
        routine_id=1
    )

    def fake_find(routine_id):
        return [existing_workout]

    use_case = CreateWorkoutUseCase(repository=fake_repo)
    use_case.find_workouts_by_routine_use_case = fake_find

    new_workout = WorkoutCreate(
        weather="Cloudy",
        kcal=250,
        title="Conflicting Run",
        temp=22.0,
        duration=60,
        planner="John",
        hour="10:30",
        date=(datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
        sport="Running",
        routine_id=1
    )

    with pytest.raises(Exception) as exc_info:
        use_case.execute(new_workout)

    assert "Conflito de horário" in str(exc_info.value)
    fake_repo.create.assert_not_called()
