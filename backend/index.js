import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: "postgres",   
  user: "n8n",
  password: "n8npass",
  database: "mails",
  port: 5432,
});

app.get("/emails", async (req, res) => {
  const { user } = req.query; // recibe ?user=Carlos
  try {
    let query = "SELECT * FROM incidencias";
    const params = [];

    if (user && user !== "Soporte") {
      query += " WHERE tecnico = $1"; // filtra solo por ese técnico
      params.push(user);
    }
    query += " ORDER BY id DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al conectar:", err);
    res.status(500).json({ error: "Error al conectar con la base de datos" });
  }
});

app.patch("/emails/:id", async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // debe venir 'abierta' o 'cerrada'

  try {
    const result = await pool.query(
      "UPDATE incidencias SET estado = $1 WHERE id = $2 RETURNING *",
      [estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Incidencia no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error actualizando incidencia:", err);
    res.status(500).json({ error: "Error al actualizar la incidencia" });
  }
});


app.listen(3000, () => {
  console.log("API escuchando en puerto 3000");

});

