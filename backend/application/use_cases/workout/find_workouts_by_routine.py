from fastapi import Depends

from domain.repositories.workout_repository import WorkoutRepository
from schemas.workout_schema import WorkoutResponse


class FindWorkoutsByRoutineUseCase:
    def __init__(self, repository: WorkoutRepository = Depends()):
        self.repository = repository

    def execute(self):
        return self.repository.find_by_routine()
    
    def execute(self, routine_id: int) -> WorkoutResponse | None:
        workout = self.repository.find_by_routine(routine_id)
        if not workout:
            return None
        return workout