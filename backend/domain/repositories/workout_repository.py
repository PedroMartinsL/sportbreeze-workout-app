from typing import List
from fastapi import Depends
from sqlalchemy.orm import Session
from dependencies import get_session
from domain.entities.workout import Workout
from schemas.workout_schema import WorkoutCreate

class WorkoutRepository:
    def __init__(self, db: Session = Depends(get_session)):
        self.db = db

    def create(self, workout_data: WorkoutCreate):
        workout = Workout(**workout_data.model_dump())
        self.db.add(workout)
        self.db.commit()
        self.db.refresh(workout)
        return workout

    def find_by_routine(self, routine_id) -> List[Workout] | None:
        return self.db.query(Workout).filter(Workout.routine_id == routine_id)
    
    def remove(self, workout_id: int):
        workout = self.db.query(Workout).filter(Workout.id == workout_id).first()
        if workout:
            self.db.delete(workout)
            self.db.commit()
        return workout
    
    def update(self, workout_id: int, update_data: dict):
        workout = self.db.query(Workout).filter(Workout.id == workout_id).first()
        if not workout:
            return None

        for field, value in update_data.items():
            setattr(workout, field, value)

        self.db.commit()
        self.db.refresh(workout)
        return workout