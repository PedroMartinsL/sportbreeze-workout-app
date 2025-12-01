import pytest
from unittest.mock import MagicMock
from domain.entities.device import Device
from application.use_cases.device.update_device import UpdateDeviceUseCase

@pytest.fixture
def fake_repo():
    repo = MagicMock()
    repo.update = MagicMock()  # repository.update não é async
    return repo

@pytest.fixture
def use_case(fake_repo):
    return UpdateDeviceUseCase(repository=fake_repo)

@pytest.mark.asyncio
async def test_execute_calls_update_when_token_different(use_case, fake_repo):
    device = Device(id=1, user_id=42, device_token="abc123")
    update_data = {"device_token": "xyz789"}

    updated_device = Device(id=1, user_id=42, device_token="xyz789")
    fake_repo.update.return_value = updated_device  # retorna Device direto

    result = await use_case.execute(device, update_data)

    assert result == updated_device
    fake_repo.update.assert_called_once_with(device, update_data)  # use assert_called_once_with
