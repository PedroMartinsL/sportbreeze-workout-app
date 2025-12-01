from application.use_cases.device.set_device import SetDeviceUseCase
import pytest
from unittest.mock import AsyncMock, MagicMock
from domain.entities.device import Device
from schemas.device_schema import SetDeviceSchema

@pytest.fixture
def fake_repo():
    repo = MagicMock()
    repo.create = MagicMock()  # não AsyncMock
    return repo

@pytest.fixture
def fake_find_use_case():
    return AsyncMock()

@pytest.fixture
def fake_update_use_case():
    return AsyncMock()

@pytest.fixture
def use_case(fake_repo, fake_find_use_case, fake_update_use_case):
    return SetDeviceUseCase(
        repository=fake_repo,
        find_device_by_user_use_case=fake_find_use_case,
        update_device_use_case=fake_update_use_case
    )

@pytest.mark.asyncio
async def test_execute_updates_existing_device(use_case, fake_find_use_case, fake_update_use_case):
    device_schema = SetDeviceSchema(user_id=1, device_token="new_token")
    existing_device = Device(id=10, user_id=1, device_token="old_token")
    fake_find_use_case.execute.return_value = existing_device

    updated_device = Device(id=10, user_id=1, device_token="new_token")
    fake_update_use_case.execute.return_value = updated_device

    result = await use_case.execute(device_schema)

    fake_find_use_case.execute.assert_awaited_once_with(1)
    fake_update_use_case.execute.assert_awaited_once_with(existing_device, {"user_id": 1, "device_token": "new_token"})
    assert result == updated_device

@pytest.mark.asyncio
async def test_execute_creates_new_device_if_none(use_case, fake_find_use_case, fake_repo):
    device_schema = SetDeviceSchema(user_id=2, device_token="token123")
    fake_find_use_case.execute.return_value = None

    created_device = Device(id=20, user_id=2, device_token="token123")
    fake_repo.create.return_value = created_device

    result = await use_case.execute(device_schema)

    fake_find_use_case.execute.assert_awaited_once_with(2)
    fake_repo.create.assert_called_once_with({"user_id": 2, "device_token": "token123"})
    assert result == created_device
