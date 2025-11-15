import express from "express";
import axios from "axios";

const router = express.Router();

const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY;

// Segurança: avisa caso a key falte
if (!JOOBLE_API_KEY) {
  console.warn("⚠️  AVISO: JOOBLE_API_KEY não encontrada no .env");
}

router.get("/search", async (req, res) => {
  const { keyword, location } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "Keyword é obrigatória" });
  }

  try {
    const response = await axios.post(
      `https://jooble.org/api/${JOOBLE_API_KEY}`,
      {
        keywords: keyword,
        location: location || "",
        page: 1,
      }
    );

    const jobs = response.data.jobs || [];

    return res.json({ jobs });
  } catch (error) {
    console.error("Erro Jooble:", error.response?.data || error.message);
    return res.status(500).json({ error: "Erro ao consultar API da Jooble" });
  }
});

export default router;
