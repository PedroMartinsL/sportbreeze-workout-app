import requests

headers = {
    "Authorization": "Bearer"
}

request = requests.get("http://12.0.0.1:8000/auth/refresh", headers=headers)
print(request)
print(request.json)