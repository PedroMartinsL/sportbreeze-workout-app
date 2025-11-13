# from sqlalchemy import Column, Integer, String
# from sqlalchemy.orm import relationship
# from infrastructure.database.connection import Base

# class Role(Base):
#     __tablename__ = "roles"
#     id = Column(Integer, primary_key=True)
#     name = Column(String, unique=True)
#     permissions = relationship("Permission", secondary="role_permissions", back_populates="roles")
#     users = relationship("User", secondary="user_roles", back_populates="roles")

# class Permission(Base):
#     __tablename__ = "permissions"
#     id = Column(Integer, primary_key=True)
#     name = Column(String, unique=True)
#     roles = relationship("Role", secondary="role_permissions", back_populates="permissions")
