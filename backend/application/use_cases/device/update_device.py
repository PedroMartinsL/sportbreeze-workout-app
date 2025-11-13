from fastapi import Depends
from domain.entities.device import Device
from schemas.device_schema import SetDeviceSchema
from domain.repositories.device_repository import DeviceRepository


class UpdateDeviceUseCase:
    def __init__(self, repository: DeviceRepository = Depends()):
        self.repository = repository

    async def execute(self, device: Device, update_data: dict):
        if device.device_token == update_data.get("device_token", None):
            return device
        return self.repository.update(device, update_data)