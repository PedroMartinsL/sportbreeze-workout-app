# from fastapi import APIRouter

# workout_router = APIRouter(prefix="/workouts", tags=["workouts"])

# @workout_router.get("/")
# async def getWorkout():
#     return {}
from datetime import datetime, timedelta
from typing import List
from fastapi import Depends, HTTPException

from application.use_cases.workout.find_workouts_by_routine import FindWorkoutsByRoutineUseCase
from domain.entities.workout import Workout
from domain.repositories.workout_repository import WorkoutRepository
from schemas.workout_schema import WorkoutCreate

class CreateWorkoutUseCase:
    def __init__(self, repository: WorkoutRepository = Depends(), find_workouts_by_routine_use_case: FindWorkoutsByRoutineUseCase = Depends()):
        self.repository = repository
        self.find_workouts_by_routine_use_case = find_workouts_by_routine_use_case

    def execute(self, workout_data: WorkoutCreate):
        
        # Junta data + hora
        workout_datetime = datetime.combine(workout_data.date, workout_data.hour)

        # Verifica se é no passado
        now = datetime.now()
        buffer = timedelta(seconds=30)  # ou 60 segundos
        if workout_datetime < now - buffer:
            raise HTTPException(status_code=400, detail="A data e hora do treino não podem estar no passado.")
        
        # Busca os treinos da rotina
        existing_workouts = self.find_workouts_by_routine_use_case.execute(workout_data.routine_id)

        # Chama a função de verificação
        self.check_workout_conflicts(workout_data, existing_workouts)

        # Se passou, cria o treino
        return self.repository.create(workout_data)


    def check_workout_conflicts(self, new_workout: WorkoutCreate, existing_workouts: List[Workout]):
        """
        Verifica se o novo treino conflita em data/hora com algum treino existente.
        Levanta HTTPException(400) em caso de conflito.
        """

        # Define início e fim do novo treino
        new_start = datetime.combine(new_workout.date, new_workout.hour)
        new_end = new_start + timedelta(minutes=new_workout.duration)

        for w in existing_workouts:
            existing_start = datetime.combine(w.date, w.hour)
            existing_end = existing_start + timedelta(minutes=w.duration)

            if (new_start < existing_end) and (new_end > existing_start):
                print("siiiim")
                raise HTTPException(
                    status_code=400,
                    detail=(
                        f"Time conflict: a workout already exists "
                        f"from {existing_start.strftime('%H:%M')} to {existing_end.strftime('%H:%M')}."
                    )
                )
