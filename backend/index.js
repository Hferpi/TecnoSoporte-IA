import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: "postgres",   // nombre del servicio docker
  user: "n8n",
  password: "n8npass",
  database: "mails",
  port: 5432,
});

app.get("/emails", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM incidencias ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al conectar:", err);
    res.status(500).json({ error: "Error al conectar con la base de datos" });
  }
});


app.listen(3000, () => {
  console.log("API escuchando en puerto 3000");

});

