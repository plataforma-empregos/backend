const mongoose = require("mongoose");
const path = require("path");

// Carrega o .env da raiz do projeto
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

// Importa o model
const Newsletter = require("../src/app/models/Newsletter");

async function clear() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await Newsletter.deleteMany({});
    console.log(`🧹 ${result.deletedCount} registros apagados da newsletter.`);

    process.exit();
  } catch (error) {
    console.error("Erro ao limpar newsletter:", error);
    process.exit(1);
  }
}

clear();

