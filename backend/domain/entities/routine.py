from sqlalchemy import Column, ForeignKey, Integer, String
from infrastructure.database.connection import Base
from sqlalchemy.orm import relationship

class Routine(Base):
    __tablename__ = "Routines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("Users.id"), nullable=False)

    # Relacionamento opcional com tarefas
    workouts = relationship("Workout", back_populates="routine")


