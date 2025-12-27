from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/clasificar", methods=["POST"])
def clasificar():
    data = request.get_json()
    texto = data.get("texto", "").lower()

    # Listas de palabras clave
    palabras_red = ["internet", "conexion", "red", "wifi"]
    palabras_hardware = ["ordenador", "pc", "servidor", "hardware"]
    palabras_ventas = ["comprar", "contratar", "interesado", "interesada"]

    # Clasificación
    if any(palabra in texto for palabra in palabras_red):
        tipo = "Red"
        tecnico = "Carlos"
    elif any(palabra in texto for palabra in palabras_hardware):
        tipo = "Hardware"
        tecnico = "Ana"
    elif any(palabra in texto for palabra in palabras_ventas):
        tipo = "Ventas"
        tecnico = "Sebastian"
    else:
        tipo = "General"
        tecnico = "Soporte"

    urgencia = "Alta" if "urgente" in texto else "Normal"

    return jsonify({
        "tipo": tipo,
        "urgencia": urgencia,
        "tecnico": tecnico
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
