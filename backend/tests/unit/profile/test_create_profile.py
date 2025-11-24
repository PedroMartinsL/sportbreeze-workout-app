import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException

from application.use_cases.profile.create_profile import CreateProfileUseCase
from schemas.profile_schema import ProfileCreate


@pytest.fixture
def fake_repo():
    return MagicMock()


@pytest.fixture
def use_case(fake_repo):
    return CreateProfileUseCase(repository=fake_repo)


@pytest.fixture
def profile_data():
    return ProfileCreate(
        user_id=1,
        age=25,
        weight=75.5,
        height=1.75,
        sports="running,cycling",
        available_days="Mon,Wed,Fri",
        hours_per_day=2
    )


# -----------------------------
# TESTE: Criar perfil com sucesso
# -----------------------------
def test_create_profile_success(use_case, fake_repo, profile_data):
    """Deve criar um perfil quando o usuário ainda não tem perfil"""
    fake_repo.find_by_user_id.return_value = None
    fake_created_profile = MagicMock()
    fake_repo.create.return_value = fake_created_profile

    result = use_case.execute(profile_data)

    assert result == fake_created_profile
    fake_repo.find_by_user_id.assert_called_once_with(1)
    fake_repo.create.assert_called_once_with(profile_data)


# -----------------------------
# TESTE: Perfil já existe
# -----------------------------
def test_create_profile_already_exists(use_case, fake_repo, profile_data):
    """Deve lançar erro 400 quando o usuário já tem um perfil"""
    existing_profile = MagicMock()
    fake_repo.find_by_user_id.return_value = existing_profile

    with pytest.raises(HTTPException) as exc:
        use_case.execute(profile_data)

    assert exc.value.status_code == 400
    assert exc.value.detail == "Profile already exists for this user"
    fake_repo.find_by_user_id.assert_called_once_with(1)
    fake_repo.create.assert_not_called()


# -----------------------------
# TESTE: Criar perfil com campos opcionais
# -----------------------------
def test_create_profile_minimal_data(use_case, fake_repo):
    """Deve criar perfil mesmo com campos opcionais vazios"""
    minimal_data = ProfileCreate(
        user_id=2,
        age=None,
        weight=None,
        height=None
    )
    fake_repo.find_by_user_id.return_value = None
    fake_created_profile = MagicMock()
    fake_repo.create.return_value = fake_created_profile

    result = use_case.execute(minimal_data)

    assert result == fake_created_profile
    fake_repo.find_by_user_id.assert_called_once_with(2)
    fake_repo.create.assert_called_once_with(minimal_data)
