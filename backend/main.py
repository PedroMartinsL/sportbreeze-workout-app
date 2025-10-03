from fastapi import FastAPI
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

app = FastAPI()

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from .application.task.task_use_case import task_router
from .application.auth.auth_routes import auth_router

# Run to execute: 
# uvicorn main:app --reload
app.include_router(auth_router)
app.include_router(task_router)