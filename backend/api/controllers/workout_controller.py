from application.use_cases.workout.create_workout_by_goals import CreateWorkoutByGoalsUseCase
from dependencies import verify_token
from domain.entities.user import User
from fastapi import APIRouter, Depends, HTTPException
from typing import List

from application.use_cases.workout.find_workouts_by_routine import FindWorkoutsByRoutineUseCase
from application.use_cases.workout.delete_workout import DeleteWorkoutUseCase
from application.use_cases.workout.update_workout_use_case import UpdateWorkoutUseCase
from schemas.workout_schema import WorkoutGoals, WorkoutResponse, WorkoutUpdate

workout_router = APIRouter(prefix="/workouts", tags=["Workouts"])


@workout_router.post("/", response_model=WorkoutResponse)
async def create_workout(workout: WorkoutGoals, use_case: CreateWorkoutByGoalsUseCase = Depends(), user: User = Depends(verify_token)):
    try:
        return await use_case.execute(workout, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@workout_router.get("/{routine_id}", response_model=List[WorkoutResponse])
async def get_workouts_by_routine(routine_id: int, use_case: FindWorkoutsByRoutineUseCase = Depends(), user: User = Depends(verify_token)):
    result = use_case.execute(routine_id)
    if not result:
        raise HTTPException(status_code=404, detail="User workouts not found")
    return result

@workout_router.delete("/{workout_id}", response_model=WorkoutResponse)
async def delete_workout(workout_id: int, use_case: DeleteWorkoutUseCase = Depends(), user: User = Depends(verify_token)):
    result = use_case.execute(workout_id)
    if not result:
        raise HTTPException(status_code=404, detail="User workout not found")
    return result

@workout_router.put("/{workout_id}", response_model=WorkoutResponse)
async def update_workout(workout_id: int, workout_data: WorkoutUpdate, use_case: UpdateWorkoutUseCase = Depends(), user: User = Depends(verify_token)):
    result = use_case.execute(workout_id, workout_data)
    if not result:
        raise HTTPException(status_code=404, detail="User workout not found")
    return result

