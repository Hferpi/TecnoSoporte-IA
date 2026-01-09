CREATE TABLE IF NOT EXISTS incidencias (
  id SERIAL PRIMARY KEY,
  texto TEXT NOT NULL,
  tipo VARCHAR(50),
  urgencia VARCHAR(50),
  tecnico VARCHAR(50),
  estado VARCHAR(50),
  fecha TIMESTAMP DEFAULT NOW(),
  remitente VARCHAR(150)
);
