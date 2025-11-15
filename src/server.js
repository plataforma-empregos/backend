import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY;

app.use(cors());
app.use(express.json());

// ROTA PARA BUSCAR VAGAS
app.get("/api/jobs/search", async (req, res) => {
  try {
    const keyword = req.query.keyword;

    if (!keyword) {
      return res.status(400).json({ error: "Parâmetro 'keyword' é obrigatório" });
    }

    // 🔥 Requisição para a API Jooble
    const response = await axios.post(
      `https://jooble.org/api/${JOOBLE_API_KEY}`,
      { keywords: keyword }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Erro na API Jooble:", error.response?.data || error.message);

    res.status(500).json({
      error: "Erro ao buscar vagas na API Jooble",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

//mongoose
// .connect(process.env.MONGO_URI)
// .then(() => {
//    console.log("Connected to MongoDB");
//    app.listen(PORT, () => console.log("Server running on", PORT));
//  })
//  .catch((err) => {
//    console.error("Mongo connection error", err);
//    process.exit(1);
//  });
