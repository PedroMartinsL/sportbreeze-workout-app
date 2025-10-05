from enum import Enum
from sqlalchemy import Column, Date, Float, ForeignKey, Integer, String, Time
from domain.entities.enums.sports import SportEnum
from infrastructure.database.connection import Base
from sqlalchemy.orm import relationship

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
