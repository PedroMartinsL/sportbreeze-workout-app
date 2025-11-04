from fastapi import Depends
from schemas.workout_schema import WorkoutUpdate
from domain.repositories.workout_repository import DeviceRepository


class UpdateDeviceUseCase:
    def __init__(self, repository: DeviceRepository = Depends()):
        self.repository = repository

    def execute(self, device_id: int, update_data: WorkoutUpdate):
        data_dict = update_data.model_dump(exclude_unset=True)
        # exclude_unset=True → só pega campos realmente enviados pelo usuário
        return self.repo.update(device_id, data_dict)