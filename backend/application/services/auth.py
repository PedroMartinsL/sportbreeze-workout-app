from datetime import timedelta

from fastapi import Depends, HTTPException
from application.use_cases.user.find_user_by_email import FindUserByEmailUseCase
from domain.entities.user import User
from infrastructure.security.jwt_handler import create_token
from schemas.user_schema import UserLogin
from main import bcrypt_context

class AuthService:
    def __init__(self, find_user_by_email_use_case: FindUserByEmailUseCase = Depends()):
        self.find_user_by_email_use_case = find_user_by_email_use_case

    def authenticate_user(self, user: User, password: str):
        if not user:
            return None
        elif not bcrypt_context.verify(password, user.password):
            return None
        return user

    def login(self, login_schema: UserLogin):
        user = self.find_user_by_email_use_case.execute(login_schema.email)
        user = self.authenticate_user(user, login_schema.password)
        if not user:
            raise HTTPException(status_code=400, detail="User not found or invalid credentials")
        else:
            access_token = create_token(user.id)
            refresh_token = create_token(user.id, token_duration=timedelta(days=7))
            return {"access_token": access_token,
                    "refresh_token": refresh_token,
                    "token_type": "Bearer"}
        
    