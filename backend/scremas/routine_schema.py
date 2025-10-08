from pydantic import BaseModel

class RoutineBase(BaseModel):
    name: str
    user_id: int

class RoutineResponse(RoutineBase):
    id: int

    class Config:
        from_attributes = True  # pydantic v2

class LocationSchema(BaseModel):
    latitude: float
    longitude: float

class ProfileSchema(BaseModel):
    #This will receive values soon
    pass

class RoutineCreate(RoutineBase):
    location: LocationSchema
    profile: ProfileSchema