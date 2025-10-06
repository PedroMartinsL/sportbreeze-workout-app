import json
from google import genai
from google.genai import types

from core.settings import GEMINI_API_KEY

# Inicializa o cliente Gemini
client = genai.Client(api_key=GEMINI_API_KEY)
# client = genai.Client(api_key="AIzaSyDrHLLjruJ3yEF-pvLSvnYTF-Y_FjNkWuU")

def call_gemini(profile: dict, prompt_text: str):
    full_prompt = (
        "Você é um agente de treino para pessoas que desejam treinar atividades físicas ao ar livre. "
        "Organize rotinas de treino detalhadas de acordo com a previsão do tempo para os próximos 7 dias. Se puder, para atividades que não envolvam um estabelecimento escreva a rota e pontos turísticos para fazer a atividade em planner\n\n"
        "Retorne a resposta em JSON com o formato:\n"
        "Rules: weather can only be one from: SUNNY, RAINY, THUNDERING, CLOUDY, FROSTY\n"
        "Rules: sports can only be one from: SWIMMING, RUNNING, CYCLING, TRAIL, WALKING, GYM, MARATHON\n"
        "{\n"
        "  'weather': 'Weather condition at the time of the workout',\n"
        "  'kcal': 'Calories burned',\n"
        "  'title': 'Brief workout description',\n"
        "  'temp': 'Temperature in Celsius',\n"
        "  'duration': 'Workout duration in minutes',\n"
        "  'planner': 'Detailed plan',\n"
        "  'hour': 'Start time in HH:mm',\n"
        "  'date': 'Workout date in YYYY-MM-DD',\n"
        "  'sport': 'Main activity type'\n"
        "}\n\n"
        f"{prompt_text}\n\n"
        f"Profile: {json.dumps(profile, ensure_ascii=False)}"
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=full_prompt,
        config=types.GenerateContentConfig(
            temperature=0.7,
            thinking_config=types.ThinkingConfig(thinking_budget=0)
        ),
    )
    return response.text


if __name__ == "__main__":
    profile = {
        "name": "Pedro",
        "age": 27,
        "fitness_level": "intermediate",
        "goals": ["run faster", "improve endurance"]
    }

    prompt = "Crie uma rotina de treino de 7 dias para São Paulo, considerando previsão do tempo."

    result = call_gemini(profile, prompt)
    print(result)
