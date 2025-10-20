from dependencies import verify_token
from domain.entities.user import User
from fastapi import APIRouter, Depends, HTTPException
from application.use_cases.routine.create_routine import CreateRoutineUseCase
from application.use_cases.routine.find_routines_by_user import FindRoutinesByUserUseCase
from application.use_cases.workout.create_workout import CreateWorkoutUseCase
from schemas.routine_schema import RoutineCreate, RoutineResponse

routine_router = APIRouter(prefix="/routines", tags=["Routines"])

@routine_router.post("/", response_model=RoutineResponse)
async def create_routine(routine: RoutineCreate, create_routine_use_case: CreateRoutineUseCase = Depends(), user: User = Depends(verify_token)):
    result = await create_routine_use_case.execute(routine, user)
    return result

@routine_router.get("/{user_id}", response_model=RoutineResponse)
async def get_routine_by_user(user_id: int, use_case: FindRoutinesByUserUseCase = Depends(), user: User = Depends(verify_token)):
    result = use_case.execute(user_id)
    if not result:
        raise HTTPException(status_code=404, detail="Routine not found")
    return result
