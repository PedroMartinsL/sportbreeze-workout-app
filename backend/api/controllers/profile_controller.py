from fastapi import APIRouter, Depends, HTTPException
from dependencies import verify_token
from domain.entities.user import User
from application.use_cases.profile.create_profile import CreateProfileUseCase
from application.use_cases.profile.update_profile import UpdateProfileUseCase
from application.use_cases.profile.find_profile_by_user import FindProfileByUserUseCase
from schemas.profile_schema import ProfileCreate, ProfileUpdate, ProfileResponse

profile_router = APIRouter(prefix="/profile", tags=["Profile"])

@profile_router.post("/", response_model=ProfileResponse)
async def create_profile(
    profile_data: ProfileUpdate,  # Usa ProfileUpdate (sem user_id obrigatório)
    use_case: CreateProfileUseCase = Depends(),
    user: User = Depends(verify_token)
):
    # Cria ProfileCreate com user_id do token
    profile_create = ProfileCreate(user_id=user.id, **profile_data.model_dump())
    return use_case.execute(profile_create)

@profile_router.get("/", response_model=ProfileResponse)
async def get_my_profile(
    use_case: FindProfileByUserUseCase = Depends(),
    user: User = Depends(verify_token)
):
    return use_case.execute(user.id)

@profile_router.put("/", response_model=ProfileResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    use_case: UpdateProfileUseCase = Depends(),
    user: User = Depends(verify_token)
):
    return use_case.execute(user.id, profile_data)
