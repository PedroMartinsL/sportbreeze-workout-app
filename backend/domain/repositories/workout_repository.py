from typing import List
from fastapi import Depends
from sqlalchemy.orm import Session
from dependencies import get_session
from domain.entities.workout import Workout
from scremas.workout_schema import WorkoutCreate

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