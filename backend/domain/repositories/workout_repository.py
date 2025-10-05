from sqlalchemy.orm import Session
from domain.entities.workout import Workout
from scremas.workout_schema import WorkoutCreate

class WorkoutRepository:

    @staticmethod
    def create(db: Session, workout_data: WorkoutCreate):
        workout = Workout(**workout_data.model_dump())
        db.add(workout)
        db.commit()
        db.refresh(workout)
        return workout

    @staticmethod
    def list_all(db: Session):
        return db.query(Workout).all()

class WorkoutService:

    @staticmethod
    def create_workout(db: Session, workout_data: WorkoutCreate):
        # Exemplo de validação de negócio
        if workout_data.kcal <= 0:
            raise ValueError("Kcal deve ser maior que zero")
        return WorkoutRepository.create(db, workout_data)

    @staticmethod
    def get_all_workouts(db: Session):
        return WorkoutRepository.list_all(db)