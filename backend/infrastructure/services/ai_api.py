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
