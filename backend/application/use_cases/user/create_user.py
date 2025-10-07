from fastapi import Depends

from domain.repositories.user_repository import UserRepository
from scremas.user_schema import UserCreate
from main import bcrypt_context

class CreateUserUseCase:
    def __init__(self, repository: UserRepository = Depends()):
        self.repository = repository

    def execute(self, user_data: UserCreate):
        user_data.password = bcrypt_context.hash(user_data.password)
        return self.repository.create(user_data)