from datetime import datetime
from http.client import HTTPException
import json
from infrastructure.services.ai_api import call_gemini
from infrastructure.services.weather_api import fetch_weather
from schemas.routine_schema import LocationSchema, ProfileSchema
from schemas.workout_schema import WorkoutCreate

class AiWeatherClass():
     
     @staticmethod
     async def api_services(location: LocationSchema, routine_id: int, input: str) -> list:
        # Busca informações do clima
        weather_json = fetch_weather(location.latitude, location.longitude)
        if not weather_json:
            raise HTTPException(status_code=404, detail="Weather information not found")

        # Chamada ao Gemini AI
        payload_json = await call_gemini(
            f"{input}| weather {weather_json}"
        )

        try:
            # Se payload é string, tenta converter para JSON
            if isinstance(payload_json, str):
                data = json.loads(payload_json)
            else:
                data = payload_json

            # Garante que workouts seja uma lista
            if isinstance(data, list):
                workouts = data
            elif isinstance(data, dict):
                workouts = [data]  # transforma dict único em lista
            else:
                # qualquer outro tipo inesperado
                workouts = []
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Empty or invalid JSON from Gemini API")
        
        workout_schema = []
        
        for workout in workouts:
            if not isinstance(workout, dict):
                continue

            kcal = workout.get('kcal', 0.0)
            duration = workout.get('duration', 0)
            hour = workout.get('hour')
            date = workout.get('date')

            try:
                workout['kcal'] = float(kcal)
            except (TypeError, ValueError):
                workout['kcal'] = 0.0

            try:
                workout['duration'] = int(duration)
            except (TypeError, ValueError):
                workout['duration'] = 0

            try:
                workout['hour'] = datetime.strptime(hour, "%H:%M").time() if hour else datetime.now().time()
            except (TypeError, ValueError):
                workout['hour'] = datetime.now().time()

            try:
                workout['date'] = datetime.strptime(date, "%Y-%m-%d").date() if date else datetime.today().date()
            except (TypeError, ValueError):
                workout['date'] = datetime.today().date()

            workout['check'] = False
            workout['notify'] = False
            workout['routine_id'] = routine_id

            workout_schema.append(WorkoutCreate(**workout))

        return workout_schema