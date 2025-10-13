from fastapi import APIRouter, Depends, HTTPException
from application.services.auth import AuthService
from application.use_cases.user.create_user import CreateUserUseCase
from application.use_cases.user.find_user_by_email import FindUserByEmailUseCase
from dependencies import verify_token
from domain.entities.user import User
from infrastructure.security.jwt_handler import create_token, use_token
from schemas.user_schema import UserCreate, UserLogin

from fastapi.security import OAuth2PasswordRequestForm


auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.post("/sing_up")
async def create_account(user_schema: UserCreate, create_user_use_case: CreateUserUseCase = Depends()):
    return create_user_use_case.execute(user_schema)
        
    
@auth_router.post("/login")
async def login(login_schema: UserLogin, auth_service: AuthService = Depends()):
    try:
        return auth_service.login(login_schema=login_schema)
    except HTTPException as e:
        raise HTTPException(e)

    
@auth_router.get("/refresh")
async def use_refresh_token(user: User = Depends(verify_token)):
    """
    Verify and generate new access token, every function which uses this function has to auth tokens by header
    """
    return use_token(user)

# =================== Form for /docs====================
@auth_router.post("/login-form")
async def login_form(form_data: OAuth2PasswordRequestForm = Depends(), auth_service: AuthService = Depends()):
    user_request = auth_service.find_user_by_email_use_case.execute(form_data.username)
    user = auth_service.authenticate_user(user_request, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="User not found or invalid credentials")
    else:
        access_token = create_token(user.id)
        return {
            "access_token": access_token,
                "token_type": "Bearer"
                }
    