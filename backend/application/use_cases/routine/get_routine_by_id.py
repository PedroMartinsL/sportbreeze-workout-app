from fastapi import Depends
from sqlalchemy.orm import Session

from domain.repositories.routine_repository import RoutinePlanRepository
from scremas.routine_schema import RoutinePlanResponse


class GetRoutineByIdUseCase:
    def __init__(self, repository: RoutinePlanRepository = Depends()):
        self.repository = repository

    def execute(self, routine_id: int) -> RoutinePlanResponse | None:
        routine = self.repository.find_by_id(routine_id)
        if not routine:
            return None
        return RoutinePlanResponse.model_validate(routine)
