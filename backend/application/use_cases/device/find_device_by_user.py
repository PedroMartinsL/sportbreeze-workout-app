from fastapi import Depends

from schemas.device_schema import DeviceResponse
from domain.repositories.device_repository import DeviceRepository

class FindDeviceByUserUseCase:
    def __init__(self, repository: DeviceRepository = Depends()):
        self.repository = repository

    async def execute(self, user_id: int) -> DeviceResponse | None:
        device = self.repository.find_by_user(user_id)
        if not device:
            return None
        return DeviceResponse.model_validate(device)
