import pytest
from unittest.mock import MagicMock
from datetime import date, time
from application.use_cases.statistic.set_statistics import SetStatisticsUseCase
from schemas.statistic_schema import StatisticCreate, StatisticUpdate

@pytest.fixture
def fake_stat_repo():
    return MagicMock()

@pytest.fixture
def fake_workout_repo():
    return MagicMock()

@pytest.fixture
def use_case(fake_stat_repo, fake_workout_repo):
    return SetStatisticsUseCase(statistic_repo=fake_stat_repo, workout_repo=fake_workout_repo)

def test_execute_creates_new_statistic(use_case, fake_stat_repo, fake_workout_repo):
    """Deve criar estatística quando não houver estatística existente"""
    user_id = 1
    # Mock dos workouts do usuário
    fake_workout_repo.find_by_user.return_value = [
        MagicMock(check=True, kcal=200),
        MagicMock(check=False, kcal=100),
    ]
    # Nenhuma estatística existente
    fake_stat_repo.find_by_user_id.return_value = None

    result = use_case.execute(user_id)

    # Verifica se chamou create com os valores corretos
    fake_stat_repo.create.assert_called_once()
    created_data = fake_stat_repo.create.call_args[0][0]
    assert isinstance(created_data, StatisticCreate)
    assert created_data.user_id == user_id
    assert created_data.kcal_burned == 200
    assert created_data.activity_checked == 1

def test_execute_updates_existing_statistic(use_case, fake_stat_repo, fake_workout_repo):
    """Deve atualizar estatística quando já existir"""
    user_id = 2
    fake_workout_repo.find_by_user.return_value = [
        MagicMock(check=True, kcal=300),
        MagicMock(check=True, kcal=100),
    ]
    fake_stat_repo.find_by_user_id.return_value = MagicMock()  # Estatística existente

    result = use_case.execute(user_id)

    # Verifica se chamou update com os valores corretos
    fake_stat_repo.update.assert_called_once()
    update_user_id, update_data = fake_stat_repo.update.call_args[0]
    assert update_user_id == user_id
    assert isinstance(update_data, StatisticUpdate)
    assert update_data.kcal_burned == 400
    assert update_data.activity_checked == 2
