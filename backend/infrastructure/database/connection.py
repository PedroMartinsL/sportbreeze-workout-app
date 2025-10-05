
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
#Connection
db = create_engine("sqlite:///banco.db")

#Base
Base = declarative_base()

#Metadata