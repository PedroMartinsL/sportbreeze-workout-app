from fastapi import requests


def fetch_weather():
    api_key = "887280a7615f89462a4840db38463efa"  # substitua pela sua chave
    lat = -23.5505  # São Paulo
    lon = -46.6333

    url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=metric&lang=pt_br&appid={api_key}"

    try:
        response = requests.get(url)
        response.raise_for_status()  # levanta exceção se o status code >= 400
        return response.json()  # retorna o JSON completo
    except requests.RequestException as e:
        print("Erro ao buscar previsão do tempo:", e)
        return None