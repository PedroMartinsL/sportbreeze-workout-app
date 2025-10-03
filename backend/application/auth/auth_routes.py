from fastapi import APIRouter, Depends, HTTPException
from dependencies import get_session
from domain.entities.models import User
from main import bcrypt_context
from schemas import LoginSchema, UserSchema
from sqlalchemy.orm import Session

auth_router = APIRouter(prefix="auth", tags=["auth"])

def create_token(user_id):
    token = f"askjdnkasnkdam{user_id}"
    return token

@auth_router.get("/")
async def home():
    pass

@auth_router.post("/sing_up")
async def create_account(user_schema: UserSchema, session: Session = Depends(get_session)):
    
    user = session.query(User).filter(User.email==user_schema.email).first()
    if user:
        raise HTTPException(status_code=400, detail="E-mail already registered")
    else:
        crypt_password = bcrypt_context.hash(user_schema.password)
        new_user = User(user_schema.username, user_schema.email, crypt_password, user_schema.active, user_schema.admin)
        session.add(new_user)
        session.commit()
        return {"message": f"user registered successfully {user_schema.email}"}
    
@auth_router.post("/login")
async def login(login_schema: LoginSchema,session: Session = Depends(get_session)):
    user = session.query(User).filter(User.email==LoginSchema.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    else:
        access_token = create_token(user.id)
        return {"access_token": access_token,
                "token_type": "Bearer"}