from fastapi import Depends
from domain.repositories.statistic_repository import StatisticRepository

class FindAllStatisticsUseCase:
    def __init__(self, repository: StatisticRepository = Depends()):
        self.repository = repository

    def execute(self):
        return self.repository.find_all()
