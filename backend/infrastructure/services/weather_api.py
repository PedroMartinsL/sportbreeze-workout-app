from fastapi import requests

from core.settings import WEATHER_API


def fetch_weather(lat, lon):
    api_key = WEATHER_API

    url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=metric&lang=pt_br&appid={api_key}"

    try:
        response = requests.get(url)
        response.raise_for_status()  # levanta exceção se o status code >= 400
        return response.json()  # retorna o JSON completo
    except requests.RequestException as e:
        print("Erro ao buscar previsão do tempo:", e)
        return None