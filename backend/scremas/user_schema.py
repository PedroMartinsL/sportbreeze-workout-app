from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional

# 🔹 Base — usada por outros esquemas
class UserBase(BaseModel):
    username: str
    email: str
    active: Optional[bool] = True
    admin: Optional[bool] = False

# 🔹 Entrada (criação de usuário)
class UserCreate(UserBase):
    password: str

# 🔹 Entrada (login)
class UserLogin(BaseModel):
    email: str
    password: str

# 🔹 Saída (resposta sem senha)
class UserResponse(UserBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
        validate_assignment=True
    )

class UserFindByEmail(UserBase):
    email: str

    # raise ImportError('email-validator is not installed, run `pip install pydantic[email]`')