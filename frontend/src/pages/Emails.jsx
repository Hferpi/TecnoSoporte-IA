import { useEffect, useState } from "react";

function Emails() {
  const [incidencias, setIncidencias] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Usar el nombre del servicio backend si el frontend corre dentro de Docker
    fetch("http://localhost:3000/emails")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setIncidencias(data))
      .catch((err) => {
        console.error("Error al conectar:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div>
      <h1>Incidencias desde la BBDD</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <ul>
        {incidencias.length === 0 && !error && <li>No hay incidencias</li>}

        {incidencias.map((incidencia) => (
          <li key={incidencia.id}>
            <strong>{incidencia.texto}</strong> - Tipo: {incidencia.tipo} - 
            Urgencia: {incidencia.urgencia} - Técnico: {incidencia.tecnico} - 
            Estado: {incidencia.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Emails;
