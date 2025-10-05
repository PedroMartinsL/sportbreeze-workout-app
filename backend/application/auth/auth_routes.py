from fastapi import APIRouter, Depends, HTTPException
from dependencies import get_session, verify_token
from domain.entities.models import User
from main import bcrypt_context, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY
from schemas import LoginSchema, UserSchema
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordRequestForm


auth_router = APIRouter(prefix="auth", tags=["auth"])


def create_token(user_id, token_duration=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    date_expiration = datetime.now(timezone.utc) + token_duration
    dic_info = {
        "sub": str(user_id),
        "exp": date_expiration,
    }
    encoded_jwt = jwt.encode(dic_info, SECRET_KEY, ALGORITHM)
    return encoded_jwt



@auth_router.get("/")
async def home():
    pass

def authenticate_user(email, password, session):
    user = session.query(User).filter(User.email==email).first()
    if not user:
        return False
    elif not bcrypt_context.verify(password, user.password):
        return False
    return user

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
    user = authenticate_user(login_schema.email, login_schema.password, session)
    if not user:
        raise HTTPException(status_code=400, detail="User not found or invalid credentials")
    else:
        access_token = create_token(user.id)
        refresh_token = create_token(user.id, token_duration=timedelta(days=7))
        return {"access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "Bearer"}
    

@auth_router.post("/login-form")
async def login_form(form_data: OAuth2PasswordRequestForm = Depends(),session: Session = Depends(get_session)):
    user = authenticate_user(form_data.username, form_data.password, session)
    if not user:
        raise HTTPException(status_code=400, detail="User not found or invalid credentials")
    else:
        access_token = create_token(user.id)
        return {
            "access_token": access_token,
                "token_type": "Bearer"
                }

    
@auth_router.get("/refresh")
async def use_refresh_token(user: User = Depends(verify_token)):
    """
    Verify and generate new access token, every function which uses this function has to auth tokens by header
    """
    access_token = create_token(user.id)
    return {
        "access_token": access_token,
        "token_type": "Bearer"
    }