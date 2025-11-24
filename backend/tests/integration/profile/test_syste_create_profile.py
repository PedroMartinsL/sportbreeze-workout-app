# tests/integration/profile/test_system_create_profile.py
"""
Teste de integração para criação de perfil.
Testa o fluxo completo: Rota → Controller → Use Case → Repository → Banco de Dados.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from dependencies import get_session
from api.controllers.profile_controller import verify_token

# Importar o __init__ que já importa todas as entidades
import domain.entities  # noqa: F401
from domain.entities import User, Profile
from infrastructure.database.connection import Base


# -----------------------------
# Fixtures de Banco de Dados
# -----------------------------
@pytest.fixture(scope="function")
def test_db():
    """Cria banco SQLite em memória para testes"""
    # Cria engine SQLite
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    
    # IMPORTANTE: Importar entidades ANTES de chamar create_all
    # para garantir que as tabelas sejam criadas
    Base.metadata.create_all(bind=engine)
    
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture
def fake_user(test_db):
    """Cria usuário no banco de teste"""
    user = User(id=1, username="Test User", email="test@example.com", password="hashed", admin=False)
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture
def client(test_db, fake_user):
    """Cliente de teste com banco mockado e usuário autenticado"""
    # Override de dependências
    def override_get_session():
        try:
            yield test_db
        finally:
            pass
    
    app.dependency_overrides[get_session] = override_get_session
    app.dependency_overrides[verify_token] = lambda: fake_user
    
    yield TestClient(app)
    
    # Limpa overrides
    app.dependency_overrides.clear()


# -----------------------------
# TESTE: Criar perfil com sucesso (fluxo completo)
# -----------------------------
def test_system_create_profile_success(client, test_db):
    """Deve criar perfil passando por todas as camadas até o banco"""
    profile_data = {
        "age": 25,
        "weight": 75.5,
        "height": 1.75,
        "sports": "running,cycling",
        "available_days": "Mon,Wed,Fri",
        "hours_per_day": 2
    }
    
    response = client.post("/profile/", json=profile_data)
    
    # Verifica resposta da API
    assert response.status_code == 200
    data = response.json()
    assert data["age"] == 25
    assert data["weight"] == 75.5
    assert data["height"] == 1.75
    assert data["user_id"] == 1
    assert "id" in data
    
    # Verifica persistência no banco
    profile_in_db = test_db.query(Profile).filter(Profile.user_id == 1).first()
    assert profile_in_db is not None
    assert profile_in_db.age == 25
    assert profile_in_db.weight == 75.5
    assert profile_in_db.sports == "running,cycling"


# -----------------------------
# TESTE: Perfil já existe
# -----------------------------
def test_system_create_profile_already_exists(client, test_db):
    """Deve retornar erro 400 quando o usuário já tem perfil"""
    # Cria perfil existente no banco
    existing_profile = Profile(
        user_id=1,
        age=30,
        weight=80.0,
        height=1.80
    )
    test_db.add(existing_profile)
    test_db.commit()
    
    profile_data = {
        "age": 25,
        "weight": 75.5,
        "height": 1.75
    }
    
    response = client.post("/profile/", json=profile_data)
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Profile already exists for this user"
    
    # Verifica que não criou novo perfil
    profiles = test_db.query(Profile).filter(Profile.user_id == 1).all()
    assert len(profiles) == 1  # Apenas o perfil original
    assert profiles[0].age == 30  # Dados não foram alterados


# -----------------------------
# TESTE: Criar perfil com campos opcionais
# -----------------------------
def test_system_create_profile_minimal_data(client, test_db):
    """Deve criar perfil com campos mínimos"""
    profile_data = {
        "age": 28
        # Apenas age, outros campos opcionais omitidos
    }
    
    response = client.post("/profile/", json=profile_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["age"] == 28
    assert data["weight"] is None
    assert data["height"] is None
    assert data["user_id"] == 1
    
    # Verifica no banco
    profile_in_db = test_db.query(Profile).filter(Profile.user_id == 1).first()
    assert profile_in_db is not None
    assert profile_in_db.age == 28
    assert profile_in_db.weight is None


# -----------------------------
# TESTE: Criar perfil sem autenticação
# -----------------------------
def test_system_create_profile_unauthorized(test_db, fake_user):
    """Deve retornar erro 401 quando não autenticado"""
    # Cliente sem override de verify_token
    def override_get_session():
        try:
            yield test_db
        finally:
            pass
    
    app.dependency_overrides[get_session] = override_get_session
    # Não override verify_token - vai falhar
    client_no_auth = TestClient(app)
    
    profile_data = {"age": 25}
    
    response = client_no_auth.post("/profile/", json=profile_data)
    
    # FastAPI retorna 422 quando dependência falha (sem token)
    # Ou 401 se houver validação customizada
    assert response.status_code in [401, 422]
    
    app.dependency_overrides.clear()


# -----------------------------
# TESTE: Dados inválidos
# -----------------------------
def test_system_create_profile_invalid_data(client):
    """Deve retornar erro 422 com dados inválidos"""
    profile_data = {
        "age": "invalid_age",  # String em vez de int
        "weight": 75.5
    }
    
    response = client.post("/profile/", json=profile_data)
    
    assert response.status_code == 422  # Validation error
    assert "detail" in response.json()

