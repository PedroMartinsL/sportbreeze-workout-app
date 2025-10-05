from sqlalchemy import Boolean, Column, Integer, String
from infrastructure.database.connection import Base

class User(Base):
    __tablename__ = "Users"
    id = Column("id", Integer, primary_key=True, autoincrement=True)
    username = Column("username", String)
    email = Column("email", String, nullable=False)
    password = Column("password", String, nullable=False)
    active = Column("active", Boolean, default=True)
    admin = Column("active", Boolean, default=False)

    def __init__(self, username, email, password, active=True, admin=False):
        self.username = username
        self.email = email
        self.password = password
        self.active = active
        self.admin = admin
