import requests

headers = {
    "Authorization": "Bearer"
}

request = requests.get("http://12.0.0.1:8000/auth/refresh", headers=headers)
print(request)
print(request.json)

profile = {
    "esportes_praticados": ["corrida", "musculação"],
    "peso": 78.5,        # kg
    "idade": 29,         # anos
    "altura": 1.78,      # metros
    "frequencia": "3x por semana",  # ou número de treinos por semana: 3
    "usa_drogas": False  # True/False
}