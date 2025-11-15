from typing import Optional, Union
from pydantic import BaseModel, ConfigDict

class ProfileBase(BaseModel):
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    sports: Optional[str] = None  # CSV: "running,cycling,gym"
    available_days: Optional[str] = None  # CSV: "Mon,Wed,Fri"
    hours_per_day: Optional[int] = None  # Horas disponíveis por dia

class ProfileCreate(ProfileBase):
    user_id: int

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: int
    user_id: int

    model_config = ConfigDict(
        from_attributes=True,
        validate_assignment=True
    )