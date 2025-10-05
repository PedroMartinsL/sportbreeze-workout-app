
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from core.settings import POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST, POSTGRES_PORT
#Connection
DATABASE_URL = f"postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

db = create_engine(DATABASE_URL, echo=True)

#Base
Base = declarative_base()

#Metadata