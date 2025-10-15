from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from application.use_cases.workout.create_workout import CreateWorkoutUseCase
from application.use_cases.workout.find_workouts_by_routine import FindWorkoutsByRoutineUseCase
from application.use_cases.workout.delete_workout import DeleteWorkoutUseCase
from schemas.workout_schema import WorkoutCreate, WorkoutResponse

workout_router = APIRouter(prefix="/workouts", tags=["Workouts"])


@workout_router.post("/", response_model=WorkoutResponse)
async def create_workout(workout: WorkoutCreate, use_case: CreateWorkoutUseCase = Depends()):
    try:
        return use_case.execute(workout)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@workout_router.get("/{routine_id}", response_model=List[WorkoutResponse])
async def get_workouts_by_routine(routine_id: int, use_case: FindWorkoutsByRoutineUseCase = Depends()):
    result = use_case.execute(routine_id)
    if not result:
        raise HTTPException(status_code=404, detail="User workouts not found")
    return result

@workout_router.delete("/{workout_id}", response_model=WorkoutResponse)
async def delete_workout(workout_id: int, use_case: DeleteWorkoutUseCase = Depends()):
    result = use_case.execute(workout_id)
    if not result:
        raise HTTPException(status_code=404, detail="User workout not found")
    return result

