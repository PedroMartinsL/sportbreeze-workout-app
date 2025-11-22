import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from fastapi import HTTPException

from application.use_cases.routine.create_routine import CreateRoutineUseCase
from schemas.routine_schema import RoutineCreate


# ------------------------------------------------
# FAKES para evitar SQLAlchemy
# ------------------------------------------------

class FakeProfile:
    def __init__(self, age, weight, height):
        self.age = age
        self.weight = weight
        self.height = height


class FakeUser:
    def __init__(self, id, profile=None):
        self.id = id
        self.profile = profile


# ------------------------------------------------
# FIXTURES
# ------------------------------------------------

@pytest.fixture
def fake_user():
    return FakeUser(id=10, profile=None)


@pytest.fixture
def fake_user_with_profile():
    """User com profile fake sem acionar SQLAlchemy."""
    profile = FakeProfile(age=30, weight=80, height=180)
    return FakeUser(id=20, profile=profile)


@pytest.fixture
def fake_routine_data():
    return RoutineCreate(
        name=None,
        location={"latitude": -23.55, "longitude": -46.63}
    )


@pytest.fixture
def fake_repo():
    repo = MagicMock()
    repo.create.return_value = MagicMock(id=1)
    return repo


@pytest.fixture
def fake_workout_use_case():
    uc = MagicMock()
    uc.execute.return_value = None
    return uc


@pytest.fixture
def mock_ai_services():
    with patch(
        "application.use_cases.routine.create_routine.AiWeatherClass.api_services",
        new=AsyncMock(return_value=[{"day": 1}, {"day": 2}])
    ) as mock:
        yield mock


# ------------------------------------------------
# TESTES
# ------------------------------------------------

@pytest.mark.asyncio
async def test_create_routine_success(
    fake_repo, fake_user, fake_routine_data, fake_workout_use_case, mock_ai_services
):
    use_case = CreateRoutineUseCase(
        repository=fake_repo,
        create_workout_use_case=fake_workout_use_case
    )

    result = await use_case.execute(fake_routine_data, fake_user)

    assert fake_routine_data.name == "Default workout"
    fake_repo.create.assert_called_once()
    assert result.id == 1
    mock_ai_services.assert_called_once()
    assert fake_workout_use_case.execute.call_count == 2


@pytest.mark.asyncio
async def test_create_routine_fails_without_location(fake_repo, fake_user):
    data = RoutineCreate(name="X", location=None)
    use_case = CreateRoutineUseCase(repository=fake_repo)

    with pytest.raises(HTTPException) as exc:
        await use_case.execute(data, fake_user)

    assert exc.value.status_code == 400
    assert exc.value.detail == "Location not provided"


@pytest.mark.asyncio
async def test_create_routine_user_with_profile(
    fake_repo, fake_user_with_profile, fake_routine_data, fake_workout_use_case, mock_ai_services
):
    use_case = CreateRoutineUseCase(
        repository=fake_repo,
        create_workout_use_case=fake_workout_use_case
    )

    result = await use_case.execute(fake_routine_data, fake_user_with_profile)

    assert result.id == 1
    mock_ai_services.assert_called_once()
    assert fake_workout_use_case.execute.call_count == 2


@pytest.mark.asyncio
async def test_create_routine_continues_on_workout_error(
    fake_repo, fake_user, fake_routine_data, mock_ai_services
):
    workout_uc = MagicMock()
    workout_uc.execute.side_effect = Exception("Erro forçado")

    use_case = CreateRoutineUseCase(
        repository=fake_repo,
        create_workout_use_case=workout_uc
    )

    result = await use_case.execute(fake_routine_data, fake_user)

    fake_repo.create.assert_called_once()
    mock_ai_services.assert_called_once()
    assert workout_uc.execute.call_count == 2


@pytest.mark.asyncio
async def test_create_routine_ai_services_raises(fake_repo, fake_user, fake_routine_data):
    with patch(
        "application.use_cases.routine.create_routine.AiWeatherClass.api_services",
        new=AsyncMock(side_effect=Exception("AI Error"))
    ):
        use_case = CreateRoutineUseCase(repository=fake_repo)

        with pytest.raises(Exception) as exc:
            await use_case.execute(fake_routine_data, fake_user)

        assert "AI Error" in str(exc.value)
