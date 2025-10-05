import json

def build_gemini_payload(profile: dict, prompt_text: str) -> dict:
    """
    Retorna um JSON pronto para enviar ao Gemini Flash 2.5,
    combinando o prompt com o profile fornecido.
    """
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt_text},
                    {"text": json.dumps(profile, ensure_ascii=False)}
                ]
            }
        ]
    }
    return payload

# ======= Exemplo de uso =======
profile = {
    "esportes_praticados": ["natação", "corrida"],
    "peso": 75,
    "idade": 28,
    "altura": 1.75,
    "frequencia": "3x por semana",
    "usa_drogas": False
}

prompt_text = "Gere uma rotina de treino amigável para humanos com base neste perfil:"

payload_json = build_gemini_payload(profile, prompt_text)
print(payload_json)
