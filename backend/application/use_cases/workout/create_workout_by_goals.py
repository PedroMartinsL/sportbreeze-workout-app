from application.services.ai_weather import AiWeatherClass
from application.use_cases.workout.create_workout import CreateWorkoutUseCase
from domain.entities.user import User
from schemas.workout_schema import WorkoutGoals
from fastapi import Depends, HTTPException

class CreateWorkoutByGoalsUseCase:
    def __init__(self,
                 create_workout_use_case: CreateWorkoutUseCase = Depends()):
        self.create_workout_use_case = create_workout_use_case

    def execute(self, workout_goals: WorkoutGoals, user: User):
        workouts = AiWeatherClass.api_services(
            workout_goals.location,
            user,
            workout_goals.routine.id,
            "Generate a single training plan:"
        )

        if not workouts:
            raise HTTPException(status_code=404, detail="Any workout returned by the AI service")

        workout = workouts[0]
            
        return self.create_workout_use_case.execute(workout)