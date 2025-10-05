from pydantic import BaseModel

class RoutineBase(BaseModel):
    name: str
    user_id: int

class RoutineCreate(RoutineBase):
    pass

class RoutineResponse(RoutineBase):
    id: int

    class Config:
        from_attributes = True  # pydantic v2
