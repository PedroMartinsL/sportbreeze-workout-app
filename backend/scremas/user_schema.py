from pydantic import BaseModel, EmailStr
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

    class Config:
        from_attributes = True  # <- permite converter diretamente de objetos SQLAlchemy

class UserFindByEmail(UserBase):
    email: str

    # raise ImportError('email-validator is not installed, run `pip install pydantic[email]`')