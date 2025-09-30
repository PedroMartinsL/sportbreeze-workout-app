from fastapi import FastAPI

app = FastAPI()

from .application.task.task_use_case import task_router
from .application.auth.auth_routes import auth_router

# Run to execute: 
# uvicorn main:app --reload
app.include_router(auth_router)
app.include_router(task_router)