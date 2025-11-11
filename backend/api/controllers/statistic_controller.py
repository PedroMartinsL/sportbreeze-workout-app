from typing import List
from fastapi import APIRouter, Depends, HTTPException
from dependencies import verify_token
from domain.entities.user import User
from application.use_cases.statistic.find_all_statistics import FindAllStatisticsUseCase
from schemas.statistic_schema import StatisticResponse

statistic_router = APIRouter(prefix="/statistics", tags=["Statistics"])

@statistic_router.get("/", response_model=List[StatisticResponse])
async def get_all_statistics(
    use_case: FindAllStatisticsUseCase = Depends(),
    user: User = Depends(verify_token)
):
    # Verifica se é admin
    if not user.admin:
        raise HTTPException(status_code=403, detail="Only admins can access all statistics")
    return use_case.execute()
