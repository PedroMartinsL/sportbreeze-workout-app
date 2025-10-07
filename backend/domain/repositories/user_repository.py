from sqlalchemy.orm import Session
from fastapi import Depends

from dependencies import get_session
from domain.entities.routine import Routine
from domain.entities.user import User
from scremas.user_schema import UserCreate

class UserRepository:
    def __init__(self, db: Session = Depends(get_session)):
        self.db = db

    def create(self, user_data: UserCreate) -> User:
        new_user = User(**user_data.model_dump())
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user
    
    def findByEmail(self, email: str):
        return self.db.query(User).filter(User.email==email).first()