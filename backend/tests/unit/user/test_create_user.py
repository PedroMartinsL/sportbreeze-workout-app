from application.use_cases.user.create_user import CreateUserUseCase
from schemas.user_schema import UserCreate
import pytest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException


@pytest.fixture
def fake_user():
    """Provides a mock user input for user creation."""
    return UserCreate(username="pedro", email="pedro@example.com", password="StrongPass1")


@pytest.fixture
def create_user_use_case():
    """Provides a CreateUserUseCase instance with mocked dependencies."""
    fake_repo = MagicMock()
    fake_find_email = MagicMock()
    return CreateUserUseCase(repository=fake_repo, find_user_by_email_use_case=fake_find_email)


def test_create_user_success(create_user_use_case, fake_user):
    """Should successfully create a user when the email is not already registered."""
    create_user_use_case.find_user_by_email_use_case.execute.return_value = None
    create_user_use_case.repository.create.return_value = {
        "username": fake_user.username,
        "email": fake_user.email,
        "password": "hashed_pw",
    }

    with patch("application.use_cases.user.create_user.bcrypt_context.hash") as mock_hash:
        mock_hash.return_value = "hashed_pw"

        result = create_user_use_case.execute(fake_user)

        mock_hash.assert_called_once_with("StrongPass1")
        create_user_use_case.repository.create.assert_called_once()
        assert result["password"] == "hashed_pw"


def test_create_user_email_exists(create_user_use_case, fake_user):
    """Should raise an HTTP 400 error when the email is already registered."""
    create_user_use_case.find_user_by_email_use_case.execute.return_value = {"email": "pedro@example.com"}

    with pytest.raises(HTTPException) as exc:
        create_user_use_case.execute(fake_user)

    assert exc.value.status_code == 400
    assert exc.value.detail == "E-mail already registered"
    create_user_use_case.repository.create.assert_not_called()
