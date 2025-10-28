from datetime import datetime
from http.client import HTTPException
import json
from infrastructure.services.ai_api import call_gemini
from infrastructure.services.weather_api import fetch_weather
from schemas.routine_schema import LocationSchema
from schemas.workout_schema import WorkoutCreate

class AiWeatherClass():
     
     @staticmethod
     async def api_services(location: LocationSchema, profile, routine_id: int, input: str) -> list:
        # Busca informações do clima
        weather_json = fetch_weather(location.latitude, location.longitude)
        if not weather_json:
            raise HTTPException(status_code=404, detail="Weather information not found")

        # Chamada ao Gemini AI
        payload_json = await call_gemini(
            profile.model_dump(),
            f"{input}| weather {weather_json}"
        )

        try:
            workouts = json.loads(payload_json)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Empty or invalid JSON from Gemini API")
        
        workout_schema = []

        for workout in workouts:
            workout['routine_id'] = routine_id
            workout['date'] = datetime.strptime(workout['date'], "%Y-%m-%d").date()
            workout['hour'] = datetime.strptime(workout['hour'], "%H:%M").time()

            workout_schema.append(WorkoutCreate(**workout))
        
        return workout_schema