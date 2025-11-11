from sqlalchemy import Column, Float, ForeignKey, Integer, String
from infrastructure.database.connection import Base
from sqlalchemy.orm import relationship

class Profile(Base):
    __tablename__ = "Profiles"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id"), nullable=False, unique=True)
    age = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)  # kg
    height = Column(Float, nullable=True)  # cm
    sports = Column(String, nullable=True)  # CSV: "running,cycling,gym"
    available_days = Column(String, nullable=True)  # CSV: "Mon,Wed,Fri"
    
    # Relacionamento
    user = relationship("User", backref="profile")

    def __init__(self, user_id, age=None, weight=None, height=None, sports=None, 
                 available_days=None):
        self.user_id = user_id
        self.age = age
        self.weight = weight
        self.height = height
        self.sports = sports
        self.available_days = available_days