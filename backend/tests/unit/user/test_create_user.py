# backend/tests/unit/user/test_create_user_usecase.py
from application.use_cases.user.create_user import CreateUserUseCase
from schemas.user_schema import UserCreate
import pytest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException


# Fixture simulando um usuário de entrada
@pytest.fixture
def fake_user():
    return UserCreate(username="pedro", email="pedro@example.com", password="StrongPass1")

# Fixture do use case com dependências mockadas
@pytest.fixture
def create_user_use_case():
    fake_repo = MagicMock()
    fake_find_email = MagicMock()
    return CreateUserUseCase(repository=fake_repo, find_user_by_email_use_case=fake_find_email)


# -----------------------------
# 1️⃣ Teste: cadastro com sucesso
# -----------------------------
def test_create_user_success(create_user_use_case, fake_user):
    # Simula que email não existe
    create_user_use_case.find_user_by_email_use_case.execute.return_value = None

    create_user_use_case.repository.create.return_value = {
        "username": fake_user.username,
        "email": fake_user.email,
        "password": "hashed_pw",
    }

    with patch("application.use_cases.user.create_user.bcrypt_context.hash") as mock_hash:
        mock_hash.return_value = "hashed_pw"

        result = create_user_use_case.execute(fake_user)

        # bcrypt deve ser chamado
        mock_hash.assert_called_once_with("StrongPass1")
        # repo.create deve receber o usuário com senha hash
        create_user_use_case.repository.create.assert_called_once()
        # resultado final deve ter a senha hash
        assert result["password"] == "hashed_pw"

# -----------------------------------------
# 2️⃣ Teste: cadastro falha por email existente
# -----------------------------------------
def test_create_user_email_exists(create_user_use_case, fake_user):
    # Simula que email já existe
    create_user_use_case.find_user_by_email_use_case.execute.return_value = {"email": "pedro@example.com"}

    with pytest.raises(HTTPException) as exc:
        create_user_use_case.execute(fake_user)

    assert exc.value.status_code == 400
    assert exc.value.detail == "E-mail already registered"
    # repo.create nunca deve ser chamado
    create_user_use_case.repository.create.assert_not_called()
