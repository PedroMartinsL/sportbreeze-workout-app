from dotenv import load_dotenv
import os
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer

load_dotenv()  # lê .env

POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")
WEATHER_API = os.getenv("WEATHER_API")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

oauth2_schema = OAuth2PasswordBearer(tokenUrl="auth/login-form")
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")