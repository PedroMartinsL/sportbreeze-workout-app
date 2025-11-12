from fastapi import Depends
from domain.repositories.workout_repository import WorkoutRepository
from schemas.workout_schema import WorkoutDelete


class DeleteWorkoutUseCase:
    def __init__(self, repository: WorkoutRepository = Depends()):
        self.repository = repository

    def execute(self, workout_data: int):
        workout = self.repository.remove(workout_data)

        if not workout:
            raise ValueError(f"Treino com ID {workout_data.id} não encontrado.")
    
        return workout