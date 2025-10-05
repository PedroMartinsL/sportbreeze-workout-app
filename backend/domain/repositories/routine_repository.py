from sqlalchemy.orm import Session
from fastapi import Depends

from dependencies import get_session
from domain.entities.routine import Routine

class RoutineRepository:
    def __init__(self, db: Session = Depends(get_session)):
        self.db = db

    def create(self, routine_data: dict) -> Routine:
        routine = Routine(**routine_data)
        self.db.add(routine)
        self.db.commit()
        self.db.refresh(routine)
        return routine

    def find_by_id(self, routine_id: int) -> Routine | None:
        return self.db.query(Routine).filter(Routine.id == routine_id).first()
