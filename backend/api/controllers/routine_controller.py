from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from application.use_cases.routine.create_routine import CreateRoutineUseCase
from application.use_cases.routine.get_routine_by_id import GetRoutineByIdUseCase
from dependencies import get_session
from domain.repositories.routine_repository import RoutineRepository
from scremas.routine_schema import RoutineCreate, RoutineResponse


router = APIRouter(prefix="/routines", tags=["Routines"])

@router.post("/", response_model=RoutineResponse)
def create_routine(routine: RoutineCreate):
    usecase = CreateRoutineUseCase(RoutineRepository())
    return usecase.execute(routine)

@router.get("/{routine_id}", response_model=RoutineResponse)
def get_routine_by_id(routine_id: int):
    usecase = GetRoutineByIdUseCase(RoutineRepository())
    result = usecase.execute(routine_id)
    if not result:
        raise HTTPException(status_code=404, detail="Routine not found")
    return result
