import { useState, useEffect } from 'react'

function Dashboard({ user, onLogout }) {
  const [incidencias, setIncidencias] = useState([])
  const [error, setError] = useState(null) // corregido: estado para errores

  useEffect(() => {
    const queryParam = encodeURIComponent(user); 
    fetch(`http://localhost:3000/emails?user=${queryParam}`)
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
  }, [user]);

  const toggleEstado = async (id) => {
    const incidencia = incidencias.find(i => i.id === id);
    if (!incidencia) return;
  
    const nuevoEstado = incidencia.estado === 'abierta' ? 'cerrada' : 'abierta';
  
    try {
      const res = await fetch(`http://localhost:3000/emails/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });
  
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
  
      const updated = await res.json();
  
      setIncidencias(
        incidencias.map(i => i.id === id ? updated : i)
      );
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };
  

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-900 to-blue-900 p-8 text-white">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">
          Bienvenido, <span className="text-cyan-400">{user}</span>
        </h2>

        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-lg font-semibold"
        >
          Salir
        </button>
      </div>

      {/* Incidencias */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-4">Incidencias</h3>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <ul className="flex flex-col gap-3">
          {incidencias.map((i) => (
            <li
              key={i.id}
              className={`p-4 rounded-xl flex justify-between items-center border border-white/20 ${
                i.estado === 'cerrada' && 'opacity-50 line-through'
              }`}
            >
              <div>
                <p className="font-semibold">{i.texto}</p>
                <p className="text-sm text-cyan-200">
                  {i.tipo} · Urgencia: {i.urgencia}
                </p>
                <p className="text-xs">
                  Técnico: {i.tecnico} · Remitente: {i.remitente || 'Desconocido'} · {i.fecha}
                </p>
              </div>

              <button
                onClick={() => toggleEstado(i.id)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                  i.estado === 'abierta'
                    ? 'bg-cyan-500 hover:bg-cyan-400'
                    : 'bg-gray-500'
                }`}
              >
                {i.estado === 'abierta' ? 'Cerrar' : 'Cerrada'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
