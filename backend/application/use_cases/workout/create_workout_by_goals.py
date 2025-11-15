from application.services.ai_weather import AiWeatherClass
from application.use_cases.workout.create_workout import CreateWorkoutUseCase
from domain.entities.user import User
from schemas.workout_schema import WorkoutGoals
from fastapi import Depends, HTTPException

class CreateWorkoutByGoalsUseCase:
    def __init__(self,
                 create_workout_use_case: CreateWorkoutUseCase = Depends()):
        self.create_workout_use_case = create_workout_use_case

    async def execute(self, workout_goals: WorkoutGoals, user: User):
        input = f"""
            Generate a single training plan there are my suggestion, create based on my goals: 
            (The date suggested is made for today or today + week [after 7 days])
                {workout_goals.model_dump}
        """
        workouts = await AiWeatherClass.api_services(
            workout_goals.location,
            user,
            workout_goals.routine_id,
            input
        )

        if not workouts:
            raise HTTPException(status_code=404, detail="Any workout returned by the AI service")

        workout = workouts[0]
            
        return self.create_workout_use_case.execute(workout)