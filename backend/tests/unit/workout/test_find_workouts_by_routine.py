import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException
from application.use_cases.workout.find_workouts_by_routine import FindWorkoutsByRoutineUseCase

@pytest.fixture
def fake_repo():
    return MagicMock()

def test_execute_raises_http_exception_when_invalid_id(fake_repo):
    use_case = FindWorkoutsByRoutineUseCase(repository=fake_repo)

    with pytest.raises(HTTPException) as exc:
        use_case.execute(None)

    assert exc.value.status_code == 404
    assert exc.value.detail == "Routine not found"

def test_execute_returns_none_when_no_workout_found(fake_repo):
    fake_repo.find_by_routine.return_value = None
    use_case = FindWorkoutsByRoutineUseCase(repository=fake_repo)

    result = use_case.execute(1)

    fake_repo.find_by_routine.assert_called_once_with(1)
    assert result is None

def test_execute_returns_workout_when_found(fake_repo):
    expected_workout = {
        "id": 1,
        "title": "Morning Run",
        "kcal": 300,
        "weather": "Sunny"
    }
    fake_repo.find_by_routine.return_value = expected_workout
    use_case = FindWorkoutsByRoutineUseCase(repository=fake_repo)

    result = use_case.execute(1)

    fake_repo.find_by_routine.assert_called_once_with(1)
    assert result == expected_workout
