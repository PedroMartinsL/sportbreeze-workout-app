from fastapi import FastAPI
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

app = FastAPI()

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_schema = OAuth2PasswordBearer(tokenUrl="auth/login-form")

from api.controllers.routine_controller import routine_router
from api.controllers.workout_controller import workout_router
from api.controllers.auth_controller import auth_router

# Run to execute: 
# uvicorn main:app --reload --host 0.0.0.0 --port 8000 #Rodo esse pq o outro nao funciona.
app.include_router(auth_router)
app.include_router(routine_router)
app.include_router(workout_router)

origins = [
    "http://localhost:8081",       # seu frontend React Native Web
    "http://127.0.0.1:8081",
    "*",  # opcional, permite qualquer origem (útil só em dev)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE...
    allow_headers=["*"],  # Content-Type, Authorization...
)