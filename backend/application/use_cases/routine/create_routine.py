from fastapi import Depends
from domain.repositories.routine_repository import RoutineRepository
from scremas.routine_schema import RoutineCreate, RoutineResponse


class CreateRoutineUseCase:
    def __init__(self,
                 repository: RoutineRepository = Depends()):
        self.repository = repository

    def execute(self, data: RoutineCreate):
        routine = self.repository.create(data.model_dump())
        return RoutineResponse.model_validate(routine)
