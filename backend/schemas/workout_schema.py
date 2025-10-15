from pydantic import BaseModel, ConfigDict
from datetime import date, time

class WorkoutBase(BaseModel):
    weather: str
    kcal: float
    title: str
    temp: float
    duration: int
    planner: str
    hour: time
    date: date
    sport: str
    routine_id: int

class WorkoutCreate(WorkoutBase):
    pass

class WorkoutResponse(WorkoutBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
        validate_assignment=True
    )

class WorkoutDelete(BaseModel):
    id: int