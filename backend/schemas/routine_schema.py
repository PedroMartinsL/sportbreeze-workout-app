from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class RoutineBase(BaseModel):
    name: str
    user_id: int

class RoutineResponse(RoutineBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
        validate_assignment=True
    )

class ListRoutineResponse(RoutineResponse):
    routines: List[RoutineResponse]

class LocationSchema(BaseModel):
    latitude: float
    longitude: float

class ProfileSchema(BaseModel):
    #This will receive values soon
    pass

class RoutineCreate(BaseModel):
    name: Optional[str]
    location: LocationSchema