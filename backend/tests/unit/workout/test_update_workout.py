import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException

from application.use_cases.workout.update_workout_use_case import UpdateWorkoutUseCase
from schemas.workout_schema import WorkoutUpdate


@pytest.fixture
def fake_repo():
    return MagicMock()


@pytest.fixture
def use_case(fake_repo):
    return UpdateWorkoutUseCase(repository=fake_repo)


@pytest.fixture
def workout_update_data():
    return WorkoutUpdate(
        name="Morning Run",
        duration=45,
        intensity="medium",
        weather="sunny",
        kcal=400,
        title="Morning Run Routine",
        temp=20.5,
        planner="standard plan",
        hour="07:00",
        date="2025-12-01",
        sport="running",
        check=False,
        notify=True,
        routine_id=1
    )


# -----------------------------
# TESTE: Atualizar treino com sucesso
# -----------------------------
def test_update_workout_success(use_case, fake_repo, workout_update_data):
    """Deve atualizar o treino com os dados fornecidos"""
    fake_updated_workout = MagicMock()
    fake_repo.update.return_value = fake_updated_workout

    workout_id = 1
    result = use_case.execute(workout_id, workout_update_data)

    assert result == fake_updated_workout
    fake_repo.update.assert_called_once_with(
        workout_id, workout_update_data.model_dump(exclude_unset=True)
    )


# -----------------------------
# TESTE: Atualizar treino com campos parciais
# -----------------------------
def test_update_workout_partial_data(use_case, fake_repo):
    """Deve atualizar apenas os campos enviados"""
    partial_data = WorkoutUpdate(
        name="Evening Yoga",
        duration=30,
        intensity="low",
        weather="cloudy",
        kcal=200,
        title="Evening Yoga Routine",
        temp=22.0,
        planner="standard plan",
        hour="18:00",
        date="2025-12-01",
        sport="yoga",
        check=True,
        notify=False,
        routine_id=2
    )
    fake_updated_workout = MagicMock()
    fake_repo.update.return_value = fake_updated_workout

    workout_id = 2
    result = use_case.execute(workout_id, partial_data)

    assert result == fake_updated_workout
    fake_repo.update.assert_called_once_with(
        workout_id, partial_data.model_dump(exclude_unset=True)
    )


# -----------------------------
# TESTE: Tentativa de atualizar treino não existente
# -----------------------------
def test_update_workout_not_found(use_case, fake_repo, workout_update_data):
    """Se o repositório retornar None, podemos lançar um HTTPException"""
    fake_repo.update.return_value = None

    workout_id = 99
    result = use_case.execute(workout_id, workout_update_data)

    assert result is None
    fake_repo.update.assert_called_once_with(
        workout_id, workout_update_data.model_dump(exclude_unset=True)
    )
