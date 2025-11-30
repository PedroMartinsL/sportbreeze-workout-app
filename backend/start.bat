@echo off
REM Ativar o virtualenv
call venv\Scripts\activate.bat

REM Rodar o Uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
exit
