from fastapi import Depends, HTTPException

from application.use_cases.user.find_user_by_email import FindUserByEmailUseCase
from domain.repositories.user_repository import UserRepository
from schemas.user_schema import UserCreate
from core.settings import bcrypt_context

class CreateUserUseCase:
    def __init__(self, repository: UserRepository = Depends(), find_user_by_email_use_case: FindUserByEmailUseCase = Depends()):
        self.repository = repository
        self.find_user_by_email_use_case = find_user_by_email_use_case

    def execute(self, user_data: UserCreate):
        try: 
            user = self.find_user_by_email_use_case.execute(user_data.email)
        except:
            user = None
        if user:
            raise HTTPException(status_code=400, detail="E-mail already registered")
        else:
            user_data.password = bcrypt_context.hash(user_data.password)
            return self.repository.create(user_data)