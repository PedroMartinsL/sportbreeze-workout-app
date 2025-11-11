from fastapi import Depends, HTTPException
from domain.repositories.profile_repository import ProfileRepository
from schemas.profile_schema import ProfileCreate

class CreateProfileUseCase:
    def __init__(self, repository: ProfileRepository = Depends()):
        self.repository = repository

    def execute(self, data: ProfileCreate):
        # Verifica se já existe profile para este usuário
        existing = self.repository.find_by_user_id(data.user_id)
        if existing:
            raise HTTPException(status_code=400, detail="Profile already exists for this user")
        
        return self.repository.create(data)
