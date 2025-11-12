from fastapi import Depends
from schemas.workout_schema import WorkoutUpdate
from domain.repositories.workout_repository import WorkoutRepository


class UpdateWorkoutUseCase:
    def __init__(self, repository: WorkoutRepository = Depends()):
        self.repository = repository

    def execute(self, workout_id: int, update_data: WorkoutUpdate):
        data_dict = update_data.model_dump(exclude_unset=True)
        # exclude_unset=True → só pega campos realmente enviados pelo usuário
        return self.repository.update(workout_id, data_dict)