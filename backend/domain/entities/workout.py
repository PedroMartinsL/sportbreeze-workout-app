from sqlalchemy import Boolean, Column, Date, Float, ForeignKey, Integer, String, Time, Enum
from infrastructure.database.connection import Base
from sqlalchemy.orm import relationship

class Workout(Base):
    __tablename__ = "Workouts"

    id = Column(Integer, primary_key=True, index=True)
    routine_id = Column(Integer, ForeignKey("Routines.id"), nullable=False)
    weather = Column(String, nullable=True)
    kcal = Column(Integer, nullable=True)
    title = Column(String, nullable=True)
    temp = Column(Float, nullable=True)
    duration = Column(Integer, nullable=True)
    planner = Column(String, nullable=True)
    hour = Column(Time, nullable=True)
    date = Column(Date, nullable=True)
    sport = Column(String, nullable=True)
    check = Column(Boolean, default=False)
    notify = Column(Boolean, default=False)

    # Relacionamento com Routine
    routine = relationship("Routine", back_populates="workouts")
