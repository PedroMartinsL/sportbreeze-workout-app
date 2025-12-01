from typing import Any, Optional
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

class WorkoutUpdate(BaseModel):
    weather: Optional[str] = None
    kcal: Optional[float] = None
    title: Optional[str] = None
    temp: Optional[float] = None
    duration: Optional[int] = None
    planner: Optional[str] = None
    hour: Optional[time] = None
    date: Optional[Any] = None
    sport: Optional[str] = None
    check: Optional[bool] = None
    notify: Optional[bool] = None
    routine_id: Optional[int] = None

class WorkoutGoals(BaseModel):
    kcal: int
    hour: time
    date: str
    sport: str
    duration: int
    location: LocationSchema
    routine_id: int