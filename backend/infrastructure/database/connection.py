# infrastructure/database/connection.py
from sqlalchemy.orm import declarative_base
from core.settings import POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST, POSTGRES_PORT

DATABASE_URL = f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

db = None
Base = declarative_base()

def init_db():
    global db
    if db is None:
        from sqlalchemy import create_engine
        db = create_engine(DATABASE_URL, echo=True)
    return db
