from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from application.use_cases.workout.create_workout import CreateWorkoutUseCase
from application.use_cases.workout.get_all_workouts import GetAllWorkoutsUseCase
from dependencies import get_session
from scremas.workout_schema import WorkoutCreate, WorkoutResponse

router = APIRouter(prefix="/workouts", tags=["Workouts"])


@router.post("/", response_model=WorkoutResponse)
def create_workout(workout: WorkoutCreate, db: Session = Depends(get_session)):
    try:
        usecase = CreateWorkoutUseCase(db)
        return usecase.execute(workout)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=List[WorkoutResponse])
def list_workouts(db: Session = Depends(get_session)):
    usecase = GetAllWorkoutsUseCase(db)
    return usecase.execute()
