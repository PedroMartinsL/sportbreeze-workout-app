# from fastapi import APIRouter

# workout_router = APIRouter(prefix="/workouts", tags=["workouts"])

# @workout_router.get("/")
# async def getWorkout():
#     return {}
from fastapi import Depends

from domain.repositories.workout_repository import WorkoutRepository
from scremas.workout_schema import WorkoutCreate

class CreateWorkoutUseCase:
    def __init__(self, repository: WorkoutRepository = Depends()):
        self.repository = repository

    def execute(self, workout_data: WorkoutCreate):
        if workout_data.kcal <= 0:
            raise ValueError("Kcal deve ser maior que zero")
        return self.repository.create(self.db, workout_data)