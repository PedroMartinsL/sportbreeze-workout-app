from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

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