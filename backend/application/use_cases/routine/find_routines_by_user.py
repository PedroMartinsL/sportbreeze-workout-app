from fastapi import Depends

from domain.repositories.routine_repository import RoutineRepository
from schemas.routine_schema import ListRoutineResponse, RoutineResponse


class FindRoutinesByUserUseCase:
    def __init__(self, repository: RoutineRepository = Depends()):
        self.repository = repository

    def execute(self, user_id: int) -> ListRoutineResponse | None:
        routines = self.repository.find_by_user(user_id)
        routines_list = routines.all() if hasattr(routines, "all") else routines

        if not routines_list:
            return None

        return ListRoutineResponse.model_validate(
            {"routines": routines_list},
        )
