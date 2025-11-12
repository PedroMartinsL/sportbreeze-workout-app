from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import date, time

from schemas.routine_schema import LocationSchema

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
    check: bool
    notify: bool
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

class WorkoutUpdate(WorkoutBase):
    pass

class WorkoutGoals(BaseModel):
    kcal: float
    hour: time
    date: date
    sport: str
    duration: int
    location: LocationSchema
    routine_id: int