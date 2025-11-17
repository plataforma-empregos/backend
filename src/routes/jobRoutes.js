const express = require("express");
const axios = require("axios");

const router = express.Router();

const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY;

// 1. AVISO SILENCIADO
// if (!JOOBLE_API_KEY) {
//   console.warn("⚠️  AVISO: JOOBLE_API_KEY não encontrada no .env");
// }

router.get("/search", async (req, res) => {
  try {
    const response = await axios.post(
      `https://jooble.org/api/${JOOBLE_API_KEY}`,
      {
        keywords: keyword,
        location: location || "",
        page: 1,
      }
    );
  } catch (error) {}
});

module.exports = router;
