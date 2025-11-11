from fastapi import Depends, HTTPException
from domain.repositories.profile_repository import ProfileRepository

class FindProfileByUserUseCase:
    def __init__(self, repository: ProfileRepository = Depends()):
        self.repository = repository

    def execute(self, user_id: int):
        profile = self.repository.find_by_user_id(user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        return profile
