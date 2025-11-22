import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException

from application.use_cases.profile.find_profile_by_user import FindProfileByUserUseCase


@pytest.fixture
def fake_repo():
    return MagicMock()


@pytest.fixture
def use_case(fake_repo):
    return FindProfileByUserUseCase(repository=fake_repo)


# -----------------------------
# TESTE: Perfil inexistente
# -----------------------------
def test_find_profile_not_found(use_case, fake_repo):
    fake_repo.find_by_user_id.return_value = None

    with pytest.raises(HTTPException) as exc:
        use_case.execute(user_id=1)

    assert exc.value.status_code == 404
    assert exc.value.detail == "Profile not found"
    fake_repo.find_by_user_id.assert_called_once_with(1)


# -----------------------------
# TESTE: Perfil encontrado
# -----------------------------
def test_find_profile_success(use_case, fake_repo):
    fake_profile = MagicMock()
    fake_repo.find_by_user_id.return_value = fake_profile

    result = use_case.execute(user_id=1)

    assert result == fake_profile
    fake_repo.find_by_user_id.assert_called_once_with(1)
