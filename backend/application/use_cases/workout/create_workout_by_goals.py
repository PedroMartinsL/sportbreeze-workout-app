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

        if user.profile:
            profile = {
                k: v
                for k, v in vars(user.profile).items()
                if not k.startswith("_") and k != "available_days"
            }
        else:
            profile = {"profile": "Average user - standard activities"}

        input = f"""
            See user profile for details:
            {profile}

            Generate a single training plan based on my suggestion, create based on my goals: 

            User GOALS:
                {workout_goals.model_dump()}

            RULE: OBEY THE DAY and hour FIELD (If the date and hour fields suggested has passed, schedule for the next week)
            ['Example': 'date': Schedule a date to Saturday] -> then select the next saturday
        """

        workouts = await AiWeatherClass.api_services(
            workout_goals.location,
            workout_goals.routine_id,
            input
        )

        if not workouts:
            raise HTTPException(status_code=404, detail="Any workout returned by the AI service")

        workout = workouts[0]
            
        return self.create_workout_use_case.execute(workout)