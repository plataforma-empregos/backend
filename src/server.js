const path = require("path");

require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const app = require("./app");

const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

if (!process.env.MONGO_URI) {
  console.error("ERRO: MONGO_URI não foi definida no arquivo .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado ao MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📚 Documentação da API: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Erro ao realizar a conexão com o MongoDB:", err);
    process.exit(1);
  });
