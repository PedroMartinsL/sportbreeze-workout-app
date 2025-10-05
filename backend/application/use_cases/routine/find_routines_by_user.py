from fastapi import Depends

from domain.repositories.routine_repository import RoutineRepository
from scremas.routine_schema import RoutineResponse


class FindRoutinesByUserUseCase:
    def __init__(self, repository: RoutineRepository = Depends()):
        self.repository = repository

    def execute(self, user_id: int) -> RoutineResponse | None:
        routine = self.repository.find_by_user(user_id)
        if not routine:
            return None
        return RoutineResponse.model_validate(routine)
