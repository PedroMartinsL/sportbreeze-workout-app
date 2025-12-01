import pytest
from unittest.mock import MagicMock
from application.use_cases.statistic.find_all_statistics import FindAllStatisticsUseCase

@pytest.fixture
def fake_repo():
    return MagicMock()

@pytest.fixture 
def use_case(fake_repo):
    return FindAllStatisticsUseCase(repository=fake_repo)

def test_execute_returns_all_statistics(use_case, fake_repo):
    """Deve retornar todas as estatísticas fornecidas pelo repositório"""
    fake_statistics = [
        {"id": 1, "user_id": 1, "steps": 1000},
        {"id": 2, "user_id": 2, "steps": 5000},
    ]
    fake_repo.find_all.return_value = fake_statistics

    result = use_case.execute()

    assert result == fake_statistics
    fake_repo.find_all.assert_called_once()
