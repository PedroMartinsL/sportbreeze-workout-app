from fastapi import Depends, HTTPException
from core.settings import ALGORITHM, SECRET_KEY
from domain.entities.user import User
from infrastructure.database.connection import init_db
from sqlalchemy.orm import sessionmaker, Session 
from jose import ExpiredSignatureError, jwt, JWTError

from core.settings import oauth2_schema

def get_session():
    try:
        Session = sessionmaker(bind=init_db())
        session = Session()
        yield session
    finally:
        session.close()
        

def verify_token(token: str = Depends(oauth2_schema), session: Session = Depends(get_session)):
    try:
        dic_info = jwt.decode(token, SECRET_KEY, ALGORITHM)
        user_id = int(dic_info.get("sub"))
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired — please log in again")
    except JWTError:
        raise HTTPException(status_code=401, detail="Access denied, verify your token validation")
    
    user = session.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Access")
    return user 