from datetime import datetime, timedelta
from application.use_cases.workout.create_workout import CreateWorkoutUseCase
from schemas.workout_schema import WorkoutCreate
import pytest
from unittest.mock import MagicMock

@pytest.fixture
def fake_repo():
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
    use_case = CreateWorkoutUseCase(repository=fake_repo)
    new_workout = WorkoutCreate(
        weather="Cloudy",
        kcal=300,
        title="Morning Run",
        temp=20.0,
        duration=60,
        planner="John",
        hour=(datetime.now() + timedelta(hours=1)).strftime("%H:%M"),
        date=(datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
        sport="Running",
        routine_id=1
    )
    result = use_case.execute(new_workout)
    assert result["title"] == "Running"
    fake_repo.create.assert_called_once_with(new_workout)

def test_create_workout_valid_data(fake_repo):
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

    use_case = CreateWorkoutUseCase(repository=fake_repo, find_workouts_by_routine_use_case=fake_find)

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

    assert "Time conflict" in str(exc_info.value)
    fake_repo.create.assert_not_called()

