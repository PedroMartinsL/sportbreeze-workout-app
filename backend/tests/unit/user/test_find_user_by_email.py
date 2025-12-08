import pytest
from unittest.mock import MagicMock
from application.use_cases.user.find_user_by_email import FindUserByEmailUseCase
from schemas.user_schema import UserFindByEmail


@pytest.fixture
def fake_repo():
    """Provides a mock repository for user data access."""
    return MagicMock()


@pytest.fixture
def find_user_use_case(fake_repo):
    """Provides a FindUserByEmailUseCase instance with a mocked repository."""
    return FindUserByEmailUseCase(repository=fake_repo)


def test_user_found(find_user_use_case, fake_repo):
    """Should return the user when the email exists in the repository."""
    request = UserFindByEmail(email="pedro@example.com")
    expected_user = {"username": "pedro", "email": "pedro@example.com"}
    fake_repo.findByEmail.return_value = expected_user

    result = find_user_use_case.execute(request)

    fake_repo.findByEmail.assert_called_once_with(request)
    assert result == expected_user


def test_user_not_found(find_user_use_case, fake_repo):
    """Should return None when the user is not found."""
    request = UserFindByEmail(email="pedro@example.com")
    fake_repo.findByEmail.return_value = None

    result = find_user_use_case.execute(request)

    fake_repo.findByEmail.assert_called_once_with(request)
    assert result is None
