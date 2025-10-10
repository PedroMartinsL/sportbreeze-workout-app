import re
from pydantic import BaseModel, ConfigDict, EmailStr, field_validator
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

    @field_validator("password")
    def password_strength(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Senha deve ter pelo menos 6 caracteres")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Senha deve conter pelo menos uma letra maiúscula")
        if not re.search(r"[0-9]", v):
            raise ValueError("Senha deve conter pelo menos um número")
        return v

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