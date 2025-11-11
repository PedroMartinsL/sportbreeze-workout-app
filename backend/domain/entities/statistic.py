from sqlalchemy import Column, Float, ForeignKey, Integer, String
from infrastructure.database.connection import Base
from sqlalchemy.orm import relationship

class Statistic(Base):
    __tablename__ = "Statistics"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    kcal_burned = Column(Float, nullable=True)
    activity_checked = Column(String, nullable=True)
    
    # Relacionamentos
    user = relationship("User", backref="statistics")


    def __init__(self, user_id, kcal_burned=None, activity_checked=None):
        self.user_id = user_id
        self.kcal_burned = kcal_burned
        self.activity_checked = activity_checked

