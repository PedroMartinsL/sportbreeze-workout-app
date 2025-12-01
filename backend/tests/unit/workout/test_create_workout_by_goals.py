from datetime import date, time
from schemas.routine_schema import LocationSchema
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException

from application.use_cases.workout.create_workout_by_goals import CreateWorkoutByGoalsUseCase
from application.use_cases.workout.create_workout import CreateWorkoutUseCase
from domain.entities.user import User
from domain.entities.profile import Profile

from schemas.workout_schema import WorkoutGoals


@pytest.fixture
def fake_create_workout_use_case():
    return MagicMock(spec=CreateWorkoutUseCase)


@pytest.fixture
def use_case(fake_create_workout_use_case):
    return CreateWorkoutByGoalsUseCase(create_workout_use_case=fake_create_workout_use_case)


@pytest.fixture
def workout_goals():
    location = LocationSchema(city="City Park", latitude=0.0, longitude=0.0)
    return WorkoutGoals(
        kcal=500,
        hour=time(7, 0),
        date="2025-12-01",
        sport="running",
        duration=60,
        location=location,
        routine_id=1
    )

@pytest.fixture
def user_with_profile():
    profile = Profile(
        user_id=1,
        age=25,
        weight=70.0,
        height=1.75,
        sports="running,cycling",
        available_days="Mon,Wed,Fri",
        hours_per_day=2
    )
    return User(id=1, email="test@example.com", profile=profile)


@pytest.fixture
def user_without_profile():
    return User(id=2, email="noprof@example.com", profile=None)


# -----------------------------
# TESTE: Criar treino com sucesso
# -----------------------------
@pytest.mark.asyncio
async def test_create_workout_success(use_case, fake_create_workout_use_case, workout_goals, user_with_profile):
    fake_workout = {"name": "Morning Run"}
    fake_create_workout_use_case.execute.return_value = fake_workout

    with patch("application.services.ai_weather.AiWeatherClass.api_services", new_callable=AsyncMock) as mock_ai:
        mock_ai.return_value = [fake_workout]

        result = await use_case.execute(workout_goals, user_with_profile)

        assert result == fake_workout
        mock_ai.assert_awaited_once_with(workout_goals.location, workout_goals.routine_id, any := mock_ai.call_args[0][2])
        fake_create_workout_use_case.execute.assert_called_once_with(fake_workout)


# -----------------------------
# TESTE: Nenhum treino retornado pela AI
# -----------------------------
@pytest.mark.asyncio
async def test_create_workout_ai_returns_none(use_case, workout_goals, user_with_profile):
    with patch("application.services.ai_weather.AiWeatherClass.api_services", new_callable=AsyncMock) as mock_ai:
        mock_ai.return_value = []

        with pytest.raises(HTTPException) as exc:
            await use_case.execute(workout_goals, user_with_profile)

        assert exc.value.status_code == 404
        assert exc.value.detail == "Any workout returned by the AI service"


# -----------------------------
# TESTE: Usuário sem perfil
# -----------------------------
@pytest.mark.asyncio
async def test_create_workout_user_without_profile(use_case, fake_create_workout_use_case, workout_goals, user_without_profile):
    fake_workout = {"name": "Standard Run"}
    fake_create_workout_use_case.execute.return_value = fake_workout

    with patch("application.services.ai_weather.AiWeatherClass.api_services", new_callable=AsyncMock) as mock_ai:
        mock_ai.return_value = [fake_workout]

        result = await use_case.execute(workout_goals, user_without_profile)

        assert result == fake_workout
        mock_ai.assert_awaited_once()
        fake_create_workout_use_case.execute.assert_called_once_with(fake_workout)
