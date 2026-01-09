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
  const result = await pool.query("SELECT * FROM emails ORDER BY created_at DESC");
  res.json(result.rows);
});

app.listen(3000, () => {
  console.log("API escuchando en puerto 3000");
});