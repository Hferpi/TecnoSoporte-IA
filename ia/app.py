from flask import Flask, request, jsonify
import db
app = Flask(__name__)


@app.route("/clasificar", methods=["POST"])
def clasificar():
    data = request.get_json()
    texto = data.get("texto", "").lower()

    palabras_red = ["internet", "conexion", "red", "wifi"]
    palabras_hardware = ["ordenador", "pc", "servidor", "hardware"]
    palabras_ventas = ["comprar", "contratar", "interesado", "interesada"]

    if any(p in texto for p in palabras_red):
        tipo = "Red"
        tecnico = "Carlos"
    elif any(p in texto for p in palabras_hardware):
        tipo = "Hardware"
        tecnico = "Ana"
    elif any(p in texto for p in palabras_ventas):
        tipo = "Ventas"
        tecnico = "Sebastian"
    else:
        tipo = "General"
        tecnico = "Soporte"

    urgencia = "Alta" if "urgente" in texto else "Normal"
    
    conn = db.get_db()
    cur = conn.cursor()
    
    # Cuando se isnerta enla bd el estado siempre es "abierta" 
    estado="abierta"

    cur.execute("""
        INSERT INTO incidencias (texto, tipo, urgencia, tecnico, estado)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
    """, (texto, tipo, urgencia, tecnico, estado))

    incidencia_id = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "id": incidencia_id,
        "tipo": tipo,
        "urgencia": urgencia,
        "tecnico": tecnico,
        "estado": estado
    })


# endpoint select * from db
@app.route("/incidencias", methods=["GET"])
def listar_incidencias():
    conn = db.get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, texto, tipo, urgencia, tecnico, estado,fecha_creacion
        FROM incidencias
        ORDER BY fecha_creacion DESC
    """)

    filas = cur.fetchall()
    cur.close()
    conn.close()

    incidencias = []
    for fila in filas:
        incidencias.append({
            "id": fila[0],
            "texto": fila[1],
            "tipo": fila[2],
            "urgencia": fila[3],
            "tecnico": fila[4],
            "estado" : fila[5],
            "fecha_creacion": fila[6]
        })

    return jsonify(incidencias)

# Endpoint cambiar estado de incidencia
@app.route("/incidencias/<int:id>/estado", methods=["PUT"])
def actualizar_estado(id):
    data = request.get_json()
    nuevo_estado = data.get("estado")

    if nuevo_estado not in ["abierta", "en_proceso", "cerrada"]:
        return jsonify({"error": "Estado no válido"}), 400

    conn = db.get_db()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE incidencias
        SET estado = %s
        WHERE id = %s
    """, (nuevo_estado, id))

    conn.commit()
    conn.close()

    return jsonify({
        "id": id,
        "estado": nuevo_estado
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)