import pytest
from unittest.mock import MagicMock
from application.use_cases.workout.delete_workout import DeleteWorkoutUseCase


@pytest.fixture
def fake_repo():
    return MagicMock()


@pytest.fixture
def use_case(fake_repo):
    return DeleteWorkoutUseCase(repository=fake_repo)


# -----------------------------
# TESTE: Deletar treino com sucesso
# -----------------------------
def test_delete_workout_success(use_case, fake_repo):
    """Deve deletar o treino quando ele existe"""
    fake_workout = MagicMock()
    fake_repo.remove.return_value = fake_workout

    workout_id = 1
    result = use_case.execute(workout_id)

    assert result == fake_workout
    fake_repo.remove.assert_called_once_with(workout_id)


# -----------------------------
# TESTE: Tentativa de deletar treino inexistente
# -----------------------------
def test_delete_workout_not_found(use_case, fake_repo):
    """Deve lançar ValueError quando o treino não existe"""
    fake_repo.remove.return_value = None

    workout_id = 99
    with pytest.raises(ValueError) as exc:
        use_case.execute(workout_id)

    assert str(exc.value) == f"Treino com ID {workout_id} não encontrado."
    fake_repo.remove.assert_called_once_with(workout_id)
