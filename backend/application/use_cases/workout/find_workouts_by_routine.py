from fastapi import Depends, HTTPException

from domain.repositories.workout_repository import WorkoutRepository
from schemas.workout_schema import WorkoutResponse


class FindWorkoutsByRoutineUseCase:
    def __init__(self, repository: WorkoutRepository = Depends()):
        self.repository = repository
    
    def execute(self, routine_id: int) -> WorkoutResponse | None:
        if not routine_id:
            raise HTTPException(status_code=404, detail="Routine not found")
        workout = self.repository.find_by_routine(routine_id)
        if not workout:
            return None
        return workout