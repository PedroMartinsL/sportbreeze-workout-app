import pytest
from unittest.mock import MagicMock
from application.use_cases.workout.create_workout import CreateWorkoutUseCase

class WorkoutCreate:
    def __init__(self, name, kcal):
        self.name = name
        self.kcal = kcal

@pytest.fixture
def fake_repo():
    """Retorna um MagicMock para o repositório"""
    repo = MagicMock()
    repo.create.return_value = {"id": 1, "name": "Corrida", "kcal": 300}
    return repo

def test_create_workout_success(fake_repo):
    # Arrange
    use_case = CreateWorkoutUseCase(repository=fake_repo)
    fake_workout = WorkoutCreate(name="Corrida", kcal=300)

    # Act
    result = use_case.execute(fake_workout)

    # Assert
    assert result["name"] == "Corrida"
    fake_repo.create.assert_called_once_with(fake_workout)


def test_create_workout_invalid_kcal(fake_repo):
    # Arrange
    use_case = CreateWorkoutUseCase(repository=fake_repo)
    fake_workout = WorkoutCreate(name="Caminhada", kcal=0)

    with pytest.raises(ValueError, match="Kcal deve ser maior que zero"):
        use_case.execute(fake_workout)

    fake_repo.create.assert_not_called()
