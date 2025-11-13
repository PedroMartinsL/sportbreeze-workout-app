from fastapi import Depends

from domain.entities.device import Device
from domain.repositories.device_repository import DeviceRepository

class FindDeviceByUserUseCase:
    def __init__(self, repository: DeviceRepository = Depends()):
        self.repository = repository

    async def execute(self, user_id: int) -> Device | None:
        device = self.repository.find_by_user(user_id)
        if not device:
            return None
        return device
