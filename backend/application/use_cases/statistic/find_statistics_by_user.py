from fastapi import Depends
from domain.repositories.statistic_repository import StatisticRepository

class FindStatisticsByUserUseCase:
    def __init__(self, repository: StatisticRepository = Depends()):
        self.repository = repository

    def execute(self, user_id: int):
        return self.repository.find_by_user_id(user_id)
