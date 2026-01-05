from groq import Groq
import json
import re

GROQ_API_KEY = "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"

client = Groq(api_key=GROQ_API_KEY)

def clasificar_con_ia(texto: str) -> dict:
    prompt = f"""
Eres un sistema automático de clasificación de incidencias de soporte técnico.

REGLAS OBLIGATORIAS:
- Si menciona internet, wifi, red, conexión → tipo = "Red"
- Si menciona ordenador, pc, servidor, hardware → tipo = "Hardware"
- Si menciona comprar, contratar, interés comercial → tipo = "Ventas"
- Si no encaja → tipo = "General"

- Si indica urgencia, problema crítico o palabras como urgente → urgencia = "Alta"
- En cualquier otro caso → urgencia = "Normal"

IMPORTANTE:
- Responde SOLO en JSON válido
- No expliques nada
- No uses markdown

Texto:
\"\"\"{texto}\"\"\"

Formato exacto:
{{
  "tipo": "Red | Hardware | Ventas | General",
  "urgencia": "Alta | Normal"
}}
"""

    try:
        print("Llamando a Groq...")

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
        )

        raw = response.choices[0].message.content.strip()
        print("Respuesta cruda IA:", raw)

        # Limpieza defensiva
        raw = re.sub(r"```json|```", "", raw).strip()
        data = json.loads(raw)

        return {
            "tipo": data.get("tipo", "General"),
            "urgencia": data.get("urgencia", "Normal"),
        }

    except Exception as e:
        print("Error IA:", e)
        return {
            "tipo": "General",
            "urgencia": "Normal",
        }
