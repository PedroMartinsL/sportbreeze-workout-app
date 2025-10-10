# backend/tests/unit/user/test_find_user_by_email_usecase.py
import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException
from application.use_cases.user.find_user_by_email import FindUserByEmailUseCase
from schemas.user_schema import UserFindByEmail

# Fixture do repositório mockado
@pytest.fixture
def fake_repo():
    return MagicMock()

# Fixture do use case
@pytest.fixture
def find_user_use_case(fake_repo):
    return FindUserByEmailUseCase(repository=fake_repo)

# ============================
# Teste 1: usuário encontrado
# ============================
def test_user_found(find_user_use_case, fake_repo):
    # Arrange
    request = UserFindByEmail(email="pedro@example.com")
    expected_user = {"username": "pedro", "email": "pedro@example.com"}
    fake_repo.findByEmail.return_value = expected_user

    # Act
    result = find_user_use_case.execute(request)

    # Assert
    fake_repo.findByEmail.assert_called_once_with(request)
    assert result == expected_user

# =======================================
# Teste 2: usuário não encontrado (404)
# =======================================
def test_user_not_found_raises_http_exception(find_user_use_case, fake_repo):
    # Arrange
    request = UserFindByEmail(email="pedro@example.com")
    fake_repo.findByEmail.return_value = None

    # Act & Assert
    with pytest.raises(HTTPException) as exc:
        find_user_use_case.execute(request)

    assert exc.value.status_code == 404
    assert exc.value.detail == "User not found"
    fake_repo.findByEmail.assert_called_once_with(request)
