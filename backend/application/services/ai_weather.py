from datetime import datetime
from http.client import HTTPException
import json
from infrastructure.services.ai_api import call_gemini
from infrastructure.services.weather_api import fetch_weather
from schemas.routine_schema import LocationSchema
from schemas.workout_schema import WorkoutCreate

class AiWeatherClass():
     
     @staticmethod
     async def api_services(location: LocationSchema, user, routine_id: int, input: str) -> list:
        # Busca informações do clima
        profile = user.profile.model_dump() if hasattr(user, "profile") and user.profile else {"profile": "default"}
        weather_json = fetch_weather(location.latitude, location.longitude)
        if not weather_json:
            raise HTTPException(status_code=404, detail="Weather information not found")

        # Chamada ao Gemini AI
        payload_json = await call_gemini(
            profile,
            f"{input}| weather {weather_json}"
        )
        try:
            if isinstance(payload_json, str):
                workouts = json.loads(payload_json)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Empty or invalid JSON from Gemini API")
        
        workout_schema = []

        for workout in workouts:
            workout['kcal'] = float(workout['kcal'])
            workout['duration'] = int(workout['duration'])
            workout['hour'] = datetime.strptime(workout['hour'], "%H:%M").time()
            workout['date'] = datetime.strptime(workout['date'], "%Y-%m-%d").date()
            workout['check'] = False
            workout['notify'] = False
            workout['routine_id'] = routine_id

            workout_schema.append(WorkoutCreate(**workout))

        return workout_schema