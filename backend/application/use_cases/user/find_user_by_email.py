from fastapi import Depends

from domain.repositories.user_repository import UserRepository
from schemas.user_schema import UserFindByEmail

class FindUserByEmailUseCase:
    def __init__(self, repository: UserRepository = Depends()):
        self.repository = repository

    def execute(self, request: UserFindByEmail):
        return self.repository.findByEmail(request)