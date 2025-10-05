from fastapi import APIRouter, Depends, HTTPException
from application.use_cases.routine.create_routine import CreateRoutineUseCase
from application.use_cases.routine.find_routines_by_user import FindRoutinesByUserUseCase
from scremas.routine_schema import RoutineCreate, RoutineResponse

routine_router = APIRouter(prefix="/routines", tags=["Routines"])

@routine_router.post("/", response_model=RoutineResponse)
def create_routine(routine: RoutineCreate, use_case: CreateRoutineUseCase = Depends()):
    return use_case.execute(routine)

@routine_router.get("/{user_id}", response_model=RoutineResponse)
def get_routine_by_user(user_id: int, use_case: FindRoutinesByUserUseCase = Depends()):
    result = use_case.execute(user_id)
    if not result:
        raise HTTPException(status_code=404, detail="Routine not found")
    return result
