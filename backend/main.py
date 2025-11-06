from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from contextlib import asynccontextmanager
import asyncio

load_dotenv()



# --- Lifespan padrão ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    from infrastructure.services.ap_scheduler import start_scheduler
    asyncio.create_task(start_scheduler())  # inicia task em paralelo
    yield  # continua inicializando o FastAPI
    
    
app = FastAPI(lifespan=lifespan)

# Run to execute: 
# uvicorn main:app --reload --host 0.0.0.0 --port 8000

origins = [
    "http://localhost:8081",       # seu frontend React Native Web
    "http://127.0.0.1:8081",
    "*",  # opcional, permite qualquer origem (útil só em dev)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE...
    allow_headers=["*"],  # Content-Type, Authorization...
)

import api.routes