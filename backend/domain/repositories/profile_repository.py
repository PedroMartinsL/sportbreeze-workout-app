from typing import Optional
from fastapi import Depends
from sqlalchemy.orm import Session
from dependencies import get_session
from domain.entities.profile import Profile
from schemas.profile_schema import ProfileCreate, ProfileUpdate

class ProfileRepository:
    def __init__(self, db: Session = Depends(get_session)):
        self.db = db

    def create(self, profile_data: ProfileCreate):
        profile = Profile(**profile_data.model_dump())
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def find_by_user_id(self, user_id: int) -> Optional[Profile]:
        return self.db.query(Profile).filter(Profile.user_id == user_id).first()
    
    def find_by_id(self, profile_id: int) -> Optional[Profile]:
        return self.db.query(Profile).filter(Profile.id == profile_id).first()

    def update(self, user_id: int, update_data: ProfileUpdate):
        profile = self.find_by_user_id(user_id)
        if not profile:
            return None

        update_dict = update_data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            if value is not None:
                setattr(profile, field, value)

        self.db.commit()
        self.db.refresh(profile)
        return profile
