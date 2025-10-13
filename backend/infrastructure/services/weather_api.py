import requests

from core.settings import WEATHER_API


def fetch_weather(latitude: float, longitude: float):

    url = f"https://api.openweathermap.org/data/2.5/forecast"
    params = {
        "lat": latitude,
        "lon": longitude,
        "units": "metric",
        "lang": "pt_br",
        "appid": WEATHER_API,
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # levanta exceção se o status code >= 400
        return response.json()  # retorna o JSON completo
    except requests.RequestException as e:
        print("Erro ao buscar previsão do tempo:", e)
        return None
    
if __name__ == "__main__":
    data = fetch_weather(-23.5505, -46.6333)  # São Paulo
    print(data)

    import requests