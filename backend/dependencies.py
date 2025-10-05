from fastapi import Depends, HTTPException
from domain.entities.user import User
from infrastructure.database.connection import db
from sqlalchemy.orm import sessionmaker, Session 
from jose import jwt, JWTError

from main import ALGORITHM, SECRET_KEY, oauth2_schema

def get_session():
    try:
        Session = sessionmaker(bind=db)
        session = Session()
        yield session
    finally:
        session.close()

def verify_token(token: str = Depends(oauth2_schema), session: Session = Depends(get_session)):
    try:
        dic_info = jwt.decode(token, SECRET_KEY, ALGORITHM)
        user_id = int(dic_info.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Access denied, verify your token validation")
    
    user = session.filter(User.id==user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Access")
    return user 