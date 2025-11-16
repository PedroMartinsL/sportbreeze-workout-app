from application.services.ai_weather import AiWeatherClass
from domain.entities.user import User
from fastapi import Depends, HTTPException
from application.use_cases.workout.create_workout import CreateWorkoutUseCase
from domain.repositories.routine_repository import RoutineRepository
from schemas.routine_schema import RoutineCreate


class CreateRoutineUseCase:
    def __init__(self,
                 repository: RoutineRepository = Depends(), create_workout_use_case: CreateWorkoutUseCase = Depends()):
        self.repository = repository
        self.create_workout_use_case = create_workout_use_case

    async def execute(self, data: RoutineCreate, user: User):
        
        if not data.location:
            raise HTTPException(status_code=400, detail="Location not provided")
        
        if not data.name:
            data.name = "Default workout"
        
        routine_dict = {
            "name" : data.name,
            "user_id" : user.id
        }
        
        routine = self.repository.create(routine_dict)

        if user.profile:
            profile = {
                k: v
                for k, v in vars(user.profile).items()
                if not k.startswith("_")
            }
        else:
            profile = {"profile": "Average user - standard activities"}

        input = f"""
            Generate a plan to workout based on these info for the next 7 days based on profile properties, approach only his available days following his aptitude:
            {profile}
        """
        
        workouts = await AiWeatherClass.api_services(data.location, routine.id, input)

        for workout in workouts:
            try:
                self.create_workout_use_case.execute(workout)
            except Exception as e:
                # Log do erro e continua com os próximos workouts
                continue

        return routine

