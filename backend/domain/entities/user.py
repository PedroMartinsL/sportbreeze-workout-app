from sqlalchemy import Boolean, Column, Integer, String
from infrastructure.database.connection import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "Users"
    id = Column("id", Integer, primary_key=True, autoincrement=True)
    username = Column("username", String)
    email = Column("email", String, nullable=False)
    password = Column("password", String, nullable=False)
    active = Column("active", Boolean, default=True)
    admin = Column("admin", Boolean, default=False)

    devices = relationship("Device", back_populates="user")
    routines = relationship("Routine", back_populates="user")

    def __init__(self, username, email, password, active=True, admin=False):
        self.username = username
        self.email = email
        self.password = password
        self.active = active
        self.admin = admin
