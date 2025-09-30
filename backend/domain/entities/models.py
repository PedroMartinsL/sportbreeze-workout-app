import enum
from sqlalchemy import create_engine, Column, String, Integer, Boolean, ForeignKey, Float, Time, Date, Enum
from sqlalchemy.orm import declarative_base, relationship
#Connection
db = create_engine("sqlite:///banco.db")

#Base
Base = declarative_base()

class SportEnum(str, enum.Enum):
    RUNNING = "RUNNING"
    GYM = "GYM"
    HIKING = "HIKING"
    CYCLING = "CYCLING"
    SWIMMING = "SWIMMING"

#Classes and table
class User(Base):
    __tablename__ = "Users"
    id = Column("id", Integer, primary_key=True, autoincrement=True)
    username = Column("username", String)
    email = Column("email", String, nullable=False)
    password = Column("password", String, nullable=False)
    active = Column("password", Boolean, default=True)

    def __init__(self, username, email, password, active=True):
        self.username = username
        self.email = email
        self.password = password
        self.active = active


class RoutinePlain(Base):
    __tablename__ = "routine_plain"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)

    # Relacionamento opcional com tarefas
    tasks = relationship("Task", back_populates="routine_plain")


class Task(Base):
    __tablename__ = "task"

    id = Column(Integer, primary_key=True, index=True)
    routine_plain_id = Column(Integer, ForeignKey("routine_plain.id"), nullable=False)
    weather = Column(String, nullable=True)
    kcal = Column(Integer, nullable=True)
    title = Column(String, nullable=True)
    temp = Column(Float, nullable=True)
    duration = Column(Integer, nullable=True)
    planner = Column(String, nullable=True)
    hour = Column(Time, nullable=True)
    date = Column(Date, nullable=True)
    sport = Column(Enum(SportEnum), nullable=True)

    # Relacionamento com RoutinePlain
    routine_plain = relationship("RoutinePlain", back_populates="tasks")

#Metadata