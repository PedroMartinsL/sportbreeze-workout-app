from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from infrastructure.database.connection import Base

class Device(Base):
    __tablename__ = "Devices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    device_id = Column(String, unique=True, index=True)  # token FCM / Expo / OneSignal

    user = relationship("User", back_populates="devices")