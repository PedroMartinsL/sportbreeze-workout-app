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
        
        routine = self.repository.create(data.routine.model_dump())
        
        workouts = await AiWeatherClass.api_services(data.location, user.profile, routine.id, "Generate a plan to workout based on these info for the next 7 days")

        for workout in workouts:
            try:
                self.create_workout_use_case.execute(workout)
            except Exception as e:
                # Log do erro e continua com os próximos workouts
                continue

        return routine

