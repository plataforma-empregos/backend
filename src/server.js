const path = require("path");
const mongoose = require("mongoose");
const app = require("./app");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const PORT = process.env.PORT || 3000;

// Validação de variáveis de ambiente
function validateEnvVars() {
  const requiredVars = ["MONGO_URI", "GOOGLE_CLIENT_ID"];
  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    console.error(
      `ERRO: As seguintes variáveis de ambiente estão ausentes: ${missingVars.join(
        ", "
      )}`
    );
    process.exit(1);
  }
}

validateEnvVars();

// Conexão com o MongoDB
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

// Tratamento de erros globais
process.on("uncaughtException", (err) => {
  console.error("Erro não tratado:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Rejeição não tratada:", promise, "Razão:", reason);
  process.exit(1);
});
