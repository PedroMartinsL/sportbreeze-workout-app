from pydantic import BaseModel, ConfigDict
from typing import Optional

class WorkoutBase(BaseModel):
    weather: str
    kcal: float
    title: str
    temp: float
    duration: int
    planner: str
    hour: str
    date: str
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
