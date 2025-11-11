from fastapi import Depends, HTTPException
from domain.repositories.profile_repository import ProfileRepository
from schemas.profile_schema import ProfileUpdate

class UpdateProfileUseCase:
    def __init__(self, repository: ProfileRepository = Depends()):
        self.repository = repository

    def execute(self, user_id: int, data: ProfileUpdate):
        profile = self.repository.update(user_id, data)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        return profile
