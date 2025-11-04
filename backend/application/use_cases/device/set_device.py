from application.use_cases.device.find_device_by_user import FindDeviceByUserUseCase
from backend.application.use_cases.device.update_device import UpdateDeviceUseCase
from domain.repositories.device_repository import DeviceRepository
from schemas.device_schema import SetDeviceSchema
from fastapi import Depends


class SetDeviceUseCase:
    def __init__(self,
                 repository: DeviceRepository = Depends(),
                 find_device_by_user_use_case: FindDeviceByUserUseCase = Depends(),
                 update_device_use_case: UpdateDeviceUseCase = Depends(),
                 ):
        self.repository = repository
        self.find_device_by_user_use_case = find_device_by_user_use_case
        self.update_device_use_case = update_device_use_case

    async def execute(self, device_schema: SetDeviceSchema):
        try:
            device = self.find_device_by_user_use_case.execute(device_schema.user_id)
            if device:
                return self.update_device_use_case.execute(device.id, device_schema.model_dump())
        except Exception as e:
            raise ValueError("Invalid code")
        return self.repository.create(device_schema.model_dump())

