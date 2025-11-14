from fastapi import Depends
from domain.repositories.workout_repository import WorkoutRepository
from schemas.statistic_schema import StatisticCreate, StatisticUpdate
from domain.repositories.statistic_repository import StatisticRepository

class SetStatisticsUseCase:
    def __init__(
        self,
        statistic_repo: StatisticRepository = Depends(),
        workout_repo: WorkoutRepository = Depends()
    ):
        self.statistic_repo = statistic_repo
        self.workout_repo = workout_repo

    def execute(self, user_id: int):
        # Buscar workouts do usuário
        workouts = self.workout_repo.find_by_user(user_id)

        checked = [w for w in workouts if w.check]

        activity_checked = len(checked)
        kcal_burned = sum(w.kcal for w in checked if w.kcal)

        # Buscar estatísticas já existentes
        existing_stat = self.statistic_repo.find_by_user_id(user_id)

        if existing_stat:
            update_schema = StatisticUpdate(
                kcal_burned=kcal_burned,
                activity_checked=activity_checked
            )

            return self.statistic_repo.update(
                user_id,
                update_schema
            )

        # Criar nova estatística
        create_data = StatisticCreate(
            user_id=user_id,
            kcal_burned=kcal_burned,
            activity_checked=activity_checked
        )

        return self.statistic_repo.create(create_data)