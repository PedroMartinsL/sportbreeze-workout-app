from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class StatisticBase(BaseModel):
    user_id: int
    kcal_burned: Optional[float] = None
    activity_checked: Optional[int] = None

class StatisticCreate(StatisticBase):
    pass

class StatisticResponse(StatisticBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
        validate_assignment=True
    )

class StatisticUpdate(BaseModel):
    kcal_burned: Optional[float] = None
    activity_checked: Optional[int] = None