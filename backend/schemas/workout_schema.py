from typing import Optional
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

class WorkoutCreate(BaseModel):
    weather: Optional[str] = None
    kcal: float
    title: Optional[str] = None
    temp: Optional[float] = None
    duration: int
    planner: Optional[str] = None
    hour: time
    date: date
    sport: str
    routine_id: Optional[int] = None

class WorkoutResponse(WorkoutBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
        validate_assignment=True
    )

class WorkoutDelete(BaseModel):
    id: int

class WorkoutUpdate(WorkoutBase):
    pass