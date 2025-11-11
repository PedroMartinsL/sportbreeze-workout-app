# import requests
# import os

# ONESIGNAL_APP_ID = os.getenv("ONESIGNAL_APP_ID")
# ONESIGNAL_REST_KEY = os.getenv("ONESIGNAL_REST_KEY")

# def send_onesignal_notification(player_id: str, title: str, message: str):
#     url = "https://onesignal.com/api/v1/notifications"
#     headers = {
#         "Authorization": f"Basic {ONESIGNAL_REST_KEY}",
#         "Content-Type": "application/json; charset=utf-8"
#     }
#     payload = {
#         "app_id": ONESIGNAL_APP_ID,
#         "include_player_ids": [player_id],
#         "headings": {"en": title},
#         "contents": {"en": message},
#     }

#     response = requests.post(url, headers=headers, json=payload)
#     if response.status_code == 200:
#         print(f"Notificação enviada para {player_id}")
#     else:
#         print(f"Erro ao enviar: {response.status_code}, {response.text}")
