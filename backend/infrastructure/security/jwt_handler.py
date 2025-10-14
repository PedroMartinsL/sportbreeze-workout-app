from datetime import datetime, timedelta, timezone

from core.settings import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from domain.entities.user import User
from jose import jwt, JWTError

def create_token(user_id, token_duration=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    date_expiration = datetime.now(timezone.utc) + token_duration
    dic_info = {
        "sub": str(user_id),
        "exp": date_expiration,
    }
    encoded_jwt = jwt.encode(dic_info, SECRET_KEY, ALGORITHM)
    return encoded_jwt

def use_token(user: User):
        access_token = create_token(user.id)
        return {
            "access_token": access_token,
            "token_type": "Bearer"
        }