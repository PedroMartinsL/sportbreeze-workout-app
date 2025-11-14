from typing import List
from fastapi import APIRouter, Depends, HTTPException
from dependencies import verify_token
from domain.entities.user import User
from application.use_cases.statistic.find_all_statistics import FindAllStatisticsUseCase
from application.use_cases.statistic.find_statistics_by_user import FindStatisticsByUserUseCase
from schemas.statistic_schema import StatisticResponse

statistic_router = APIRouter(prefix="/statistics", tags=["Statistics"])

@statistic_router.get("/me", response_model=StatisticResponse)
async def get_my_statistics(
    use_case: FindStatisticsByUserUseCase = Depends(),
    user: User = Depends(verify_token)
):
    """Get all statistics for the current logged-in user"""
    return use_case.execute(user.id)

@statistic_router.get("/", response_model=List[StatisticResponse])
async def get_all_statistics(
    use_case: FindAllStatisticsUseCase = Depends(),
    user: User = Depends(verify_token)
):
    # Verifica se é admin
    if not user.admin:
        raise HTTPException(status_code=403, detail="Only admins can access all statistics")
    return use_case.execute()
