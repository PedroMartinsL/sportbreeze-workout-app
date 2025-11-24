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
    """Deve lançar erro 404 quando o perfil não existe"""
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
    """Deve retornar o perfil quando encontrado"""
    fake_profile = MagicMock()
    fake_profile.id = 1
    fake_profile.user_id = 1
    fake_profile.age = 25
    fake_profile.weight = 75.5
    fake_repo.find_by_user_id.return_value = fake_profile

    result = use_case.execute(user_id=1)

    assert result == fake_profile
    assert result.id == 1
    assert result.user_id == 1
    fake_repo.find_by_user_id.assert_called_once_with(1)


# -----------------------------
# TESTE: Buscar perfil de outro usuário
# -----------------------------
def test_find_profile_different_user(use_case, fake_repo):
    """Deve buscar perfil pelo user_id correto"""
    fake_profile = MagicMock()
    fake_profile.user_id = 42
    fake_repo.find_by_user_id.return_value = fake_profile

    result = use_case.execute(user_id=42)

    assert result == fake_profile
    assert result.user_id == 42
    fake_repo.find_by_user_id.assert_called_once_with(42)
