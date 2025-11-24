import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException

from application.use_cases.profile.update_profile import UpdateProfileUseCase
from schemas.profile_schema import ProfileUpdate


@pytest.fixture
def fake_repo():
    return MagicMock()


@pytest.fixture
def use_case(fake_repo):
    return UpdateProfileUseCase(repository=fake_repo)


@pytest.fixture
def update_data():
    return ProfileUpdate(
        age=30,
        weight=80.0,
        height=1.80,
        sports="swimming,running",
        available_days="Mon,Tue,Wed",
        hours_per_day=3
    )


# -----------------------------
# TESTE: Atualizar perfil com sucesso
# -----------------------------
def test_update_profile_success(use_case, fake_repo, update_data):
    """Deve atualizar o perfil quando ele existe"""
    fake_updated_profile = MagicMock()
    fake_updated_profile.age = 30
    fake_updated_profile.weight = 80.0
    fake_repo.update.return_value = fake_updated_profile

    result = use_case.execute(user_id=1, data=update_data)

    assert result == fake_updated_profile
    assert result.age == 30
    assert result.weight == 80.0
    fake_repo.update.assert_called_once_with(1, update_data)


# -----------------------------
# TESTE: Perfil não encontrado
# -----------------------------
def test_update_profile_not_found(use_case, fake_repo, update_data):
    """Deve lançar erro 404 quando o perfil não existe"""
    fake_repo.update.return_value = None

    with pytest.raises(HTTPException) as exc:
        use_case.execute(user_id=1, data=update_data)

    assert exc.value.status_code == 404
    assert exc.value.detail == "Profile not found"
    fake_repo.update.assert_called_once_with(1, update_data)


# -----------------------------
# TESTE: Atualizar apenas um campo
# -----------------------------
def test_update_profile_partial(use_case, fake_repo):
    """Deve atualizar apenas os campos fornecidos"""
    partial_data = ProfileUpdate(age=35)
    fake_updated_profile = MagicMock()
    fake_updated_profile.age = 35
    fake_repo.update.return_value = fake_updated_profile

    result = use_case.execute(user_id=2, data=partial_data)

    assert result == fake_updated_profile
    assert result.age == 35
    fake_repo.update.assert_called_once_with(2, partial_data)


# -----------------------------
# TESTE: Atualizar com todos os campos None
# -----------------------------
def test_update_profile_no_changes(use_case, fake_repo):
    """Deve chamar o repositório mesmo sem mudanças"""
    empty_data = ProfileUpdate()
    fake_profile = MagicMock()
    fake_repo.update.return_value = fake_profile

    result = use_case.execute(user_id=3, data=empty_data)

    assert result == fake_profile
    fake_repo.update.assert_called_once_with(3, empty_data)


# -----------------------------
# TESTE: Atualizar perfil de outro usuário
# -----------------------------
def test_update_profile_different_user(use_case, fake_repo, update_data):
    """Deve atualizar perfil pelo user_id correto"""
    fake_updated_profile = MagicMock()
    fake_updated_profile.user_id = 99
    fake_repo.update.return_value = fake_updated_profile

    result = use_case.execute(user_id=99, data=update_data)

    assert result == fake_updated_profile
    assert result.user_id == 99
    fake_repo.update.assert_called_once_with(99, update_data)
