from sqlalchemy import Boolean, Column, Integer, String
from infrastructure.database.connection import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True, index=True)
    password = Column(String, nullable=False)
    active = Column(Boolean, default=True)
    admin = Column(Boolean, default=False)

    devices = relationship("Device", back_populates="user")
    routines = relationship("Routine", back_populates="user")
    profile = relationship("Profile", back_populates="user", uselist=False)

    def __init__(
        self,
        id=None,
        username=None,
        email=None,
        password=None,
        active=True,
        admin=False,
        profile=None,
    ):
        self.id = id
        self.username = username or ""
        self.email = email or ""
        self.password = password or ""
        self.active = active
        self.admin = admin
        self.profile = profile