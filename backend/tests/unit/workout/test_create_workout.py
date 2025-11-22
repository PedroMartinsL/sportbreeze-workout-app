"""
Testes unitários para CreateWorkoutUseCase.
"""

from datetime import date, time, datetime, timedelta
import pytest
from unittest.mock import Mock
from fastapi import HTTPException

from application.use_cases.workout.create_workout import CreateWorkoutUseCase
from schemas.workout_schema import WorkoutCreate



# =====================================================================
# FÁBRICA (HELPER)
# =====================================================================

def make_workout(**overrides):
    """Cria um WorkoutCreate válido para uso nos testes."""
    data = {
        "weather": "sunny",
        "kcal": 300.0,
        "title": "Treino padrão",
        "temp": 25.0,
        "duration": 60,
        "planner": "auto",
        "hour": time(10, 0),
        "date": date.today(),
        "sport": "running",
        "check": False,
        "notify": False,
        "routine_id": 1,
    }
    data.update(overrides)
    return WorkoutCreate(**data)


# =====================================================================
# TESTES check_workout_conflicts
# =====================================================================

def test_conflict_raises_http_exception():
    """Deve impedir criação quando o horário conflita com outro treino."""
    use_case = CreateWorkoutUseCase(repository=Mock(), find_workouts_by_routine_use_case=None)

    existing = [make_workout(hour=time(10, 0), duration=60)]   # 10:00–11:00
    new = make_workout(hour=time(10, 30), duration=60)         # 10:30–11:30

    with pytest.raises(HTTPException):
        use_case.check_workout_conflicts(new, existing)


def test_no_conflict_allows_creation():
    """Não deve lançar erro quando o novo treino não conflita."""
    use_case = CreateWorkoutUseCase(repository=Mock(), find_workouts_by_routine_use_case=None)

    existing = [make_workout(hour=time(10, 0), duration=60)]   # 10:00–11:00
    new = make_workout(hour=time(11, 0), duration=60)          # começa exatamente após

    use_case.check_workout_conflicts(new, existing)


# =====================================================================
# TESTES execute()
# =====================================================================

def test_execute_raises_when_past_datetime():
    """Deve bloquear criação de treino no passado."""
    repo = Mock()
    finder = Mock()
    use_case = CreateWorkoutUseCase(repository=repo, find_workouts_by_routine_use_case=finder)

    past_time = datetime.now() - timedelta(minutes=5)

    workout = make_workout(
        date=past_time.date(),
        hour=past_time.time()
    )

    with pytest.raises(HTTPException):
        use_case.execute(workout)


def test_execute_success():
    """Deve criar treino quando tudo está válido."""
    repo = Mock()
    repo.create.return_value = "created"

    finder = Mock()
    finder.execute.return_value = []

    use_case = CreateWorkoutUseCase(repository=repo, find_workouts_by_routine_use_case=finder)

    workout = make_workout(
        date=date.today(),
        hour=(datetime.now() + timedelta(minutes=10)).time()
    )

    result = use_case.execute(workout)

    assert result == "created"
    repo.create.assert_called_once()
    finder.execute.assert_called_once_with(workout.routine_id)


def test_execute_detects_conflict():
    """Deve detectar conflito via execute()."""
    repo = Mock()
    finder = Mock()

    conflict = make_workout(hour=time(10, 0), duration=60)
    finder.execute.return_value = [conflict]

    use_case = CreateWorkoutUseCase(repository=repo, find_workouts_by_routine_use_case=finder)

    new = make_workout(hour=time(10, 30), duration=30)

    with pytest.raises(HTTPException):
        use_case.execute(new)
