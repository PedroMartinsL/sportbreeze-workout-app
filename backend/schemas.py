from pydantic import BaseModel
from typing import Optional

class UserSchema(BaseModel):
    username: str
    email: str
    password: str
    active: Optional[bool]
    admin: Optional[bool]

    class Config:
        from_atributes = True

class LoginSchema(BaseModel):
    email: str
    password: str

    class Config:
        from_atributes = True