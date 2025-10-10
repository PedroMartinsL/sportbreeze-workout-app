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

class LocationSchema(BaseModel):
    latitude: float
    longitude: float

class ProfileSchema(BaseModel):
    #This will receive values soon
    pass

class RoutineCreate(BaseModel):
    routine: RoutineBase
    location: LocationSchema
    profile: ProfileSchema