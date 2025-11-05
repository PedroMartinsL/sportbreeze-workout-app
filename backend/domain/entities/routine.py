from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from infrastructure.database.connection import Base


class Routine(Base):
    __tablename__ = "Routines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("Users.id"), nullable=False)

    # Relacionamentos
    user = relationship("User", back_populates="routines")
    workouts = relationship("Workout", back_populates="routine")
