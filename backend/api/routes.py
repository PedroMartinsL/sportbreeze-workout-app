from api.controllers.routine_controller import routine_router
from api.controllers.workout_controller import workout_router
from api.controllers.auth_controller import auth_router
from main import app

router_list = [auth_router, workout_router, routine_router]

for router in router_list:
    app.include_router(router)