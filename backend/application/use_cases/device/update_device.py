from fastapi import Depends
from domain.entities.device import Device
from schemas.device_schema import SetDeviceSchema
from domain.repositories.device_repository import DeviceRepository


class UpdateDeviceUseCase:
    def __init__(self, repository: DeviceRepository = Depends()):
        self.repository = repository

    async def execute(self, device: Device, update_data: SetDeviceSchema):
        data_dict = update_data.model_dump(exclude_unset=True)
        if device.device_token == update_data.device_token:
            return device

        return self.repository.update(device, data_dict)