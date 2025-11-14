from typing import List, Optional
from fastapi import Depends
from sqlalchemy.orm import Session
from dependencies import get_session
from domain.entities.statistic import Statistic
from schemas.statistic_schema import StatisticCreate, StatisticUpdate


class StatisticRepository:
    def __init__(self, db: Session = Depends(get_session)):
        self.db = db

    def create(self, statistic_data: StatisticCreate):
        statistic = Statistic(**statistic_data.model_dump())
        self.db.add(statistic)
        self.db.commit()
        self.db.refresh(statistic)
        return statistic

    def find_by_id(self, statistic_id: int) -> Optional[Statistic]:
        return (
            self.db.query(Statistic)
            .filter(Statistic.id == statistic_id)
            .first()
        )
    
    def find_by_user_id(self, user_id: int) -> Optional[Statistic]:
        return (
            self.db.query(Statistic)
            .filter(Statistic.user_id == user_id)
            .first()
        )
    
    def find_all(self) -> List[Statistic]:
        return self.db.query(Statistic).all()
    
    def update(self, user_id: int, update_data: StatisticUpdate) -> Optional[Statistic]:
        statistic = self.find_by_user_id(user_id)
        if not statistic:
            return None

        update_fields = update_data.model_dump(exclude_unset=True)

        for field, value in update_fields.items():
            setattr(statistic, field, value)

        self.db.commit()
        self.db.refresh(statistic)
        return statistic
