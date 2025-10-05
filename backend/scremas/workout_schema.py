from pydantic import BaseModel
from typing import Optional

class WorkoutBase(BaseModel):
    weather: str
    kcal: float
    routine: str
    temp: float
    duration: int
    planner: str
    hour: str
    date: str
    sport: str

class WorkoutCreate(WorkoutBase):
    pass

class WorkoutResponse(WorkoutBase):
    id: int

    class Config:
        orm_mode = True
