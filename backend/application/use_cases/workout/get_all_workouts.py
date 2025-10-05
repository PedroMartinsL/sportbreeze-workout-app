from sqlalchemy.orm import Session

from domain.repositories.workout_repository import WorkoutRepository


class GetAllWorkoutsUseCase:
    def __init__(self, db: Session):
        self.db = db

    def execute(self):
        return WorkoutRepository.list_all(self.db)