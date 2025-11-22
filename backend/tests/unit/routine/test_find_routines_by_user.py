import pytest
from unittest.mock import MagicMock

from application.use_cases.routine.find_routines_by_user import FindRoutinesByUserUseCase
from schemas.routine_schema import RoutineResponse, ListRoutineResponse


# ------------------------------------------------
# FIXTURES
# ------------------------------------------------

@pytest.fixture
def fake_repo():
    """Mock do RoutineRepository."""
    return MagicMock()


@pytest.fixture
def use_case(fake_repo):
    return FindRoutinesByUserUseCase(repository=fake_repo)


@pytest.fixture
def fake_routines():
    """Lista de rotinas mockadas."""
    return [
        RoutineResponse(id=1, name="Treino A", user_id=10),
        RoutineResponse(id=2, name="Treino B", user_id=10),
    ]


# ------------------------------------------------
# TESTES
# ------------------------------------------------

def test_find_routines_returns_none_when_empty(use_case, fake_repo):
    """Retorna None quando o repositório devolve lista vazia."""

    fake_repo.find_by_user.return_value = []

    result = use_case.execute(user_id=10)

    assert result is None
    fake_repo.find_by_user.assert_called_once_with(10)


def test_find_routines_with_sqlalchemy_all(use_case, fake_repo, fake_routines):
    """Testa caso em que o repositório retorna um objeto com método .all()."""

    routines_query = MagicMock()
    routines_query.all.return_value = fake_routines

    fake_repo.find_by_user.return_value = routines_query

    result = use_case.execute(user_id=10)

    assert isinstance(result, ListRoutineResponse)
    assert len(result.routines) == 2
    assert result.routines[0].id == 1

    fake_repo.find_by_user.assert_called_once_with(10)
    routines_query.all.assert_called_once()


def test_find_routines_with_plain_list(use_case, fake_repo, fake_routines):
    """Testa caso em que o repositório já retorna lista simples."""

    fake_repo.find_by_user.return_value = fake_routines

    result = use_case.execute(user_id=10)

    assert isinstance(result, ListRoutineResponse)
    assert len(result.routines) == 2
    assert result.routines[1].name == "Treino B"

    fake_repo.find_by_user.assert_called_once_with(10)


def test_find_routines_validates_into_model(use_case, fake_repo, fake_routines):
    """Testa se o retorno final passa pelo model_validate corretamente."""

    fake_repo.find_by_user.return_value = fake_routines

    result = use_case.execute(user_id=10)

    assert isinstance(result, ListRoutineResponse)
    assert all(isinstance(r, RoutineResponse) for r in result.routines)
