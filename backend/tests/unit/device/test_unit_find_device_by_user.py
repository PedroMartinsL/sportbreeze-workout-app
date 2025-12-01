import pytest
from unittest.mock import MagicMock
from application.use_cases.device.find_device_by_user import FindDeviceByUserUseCase
from domain.entities.device import Device

@pytest.fixture
def fake_repo():
    return MagicMock()

@pytest.fixture
def use_case(fake_repo):
    return FindDeviceByUserUseCase(repository=fake_repo)

@pytest.mark.asyncio
async def test_execute_returns_device(use_case, fake_repo):
    """Deve retornar o device do usuário quando encontrado"""
    fake_device = Device(id=1, user_id=42, device_token="abc123")
    fake_repo.find_by_user.return_value = fake_device

    result = await use_case.execute(user_id=42)

    assert result == fake_device
    fake_repo.find_by_user.assert_called_once_with(42)

@pytest.mark.asyncio
async def test_execute_returns_none_when_not_found(use_case, fake_repo):
    """Deve retornar None quando o usuário não possui device"""
    fake_repo.find_by_user.return_value = None

    result = await use_case.execute(user_id=99)

    assert result is None
    fake_repo.find_by_user.assert_called_once_with(99)
