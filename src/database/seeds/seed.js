console.log("DIRNAME DO SEED:", __dirname);

const path = require("path");

// 2. Usamos process.cwd() para garantir que ele encontre o .env
//    na pasta 'backend' (D:\TrampoMatchBackEnd\backend\.env)
const dotEnvPath = path.resolve(__dirname, "../../../.env");
require("dotenv").config({ path: dotEnvPath });

const mongoose = require("mongoose");

// 3. Caminho dos models (este caminho está CORRETO)
const User = require("../../app/models/User");
const Job = require("../../app/models/Job");

(async () => {
  // 4. Verificação do MONGO_URI (agora deve funcionar)
  if (!process.env.MONGO_URI) {
    console.error(
      "❌ ERRO: MONGO_URI não definida no .env. Não é possível rodar o seed."
    );
    console.error("Tentamos carregar o .env do caminho:", dotEnvPath);
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany({});
    await Job.deleteMany({});
    const u = await User.create({
      email: "demo@demo.com",
      password: "123456",
      name: "Demo User",
      profile: {
        name: "Demo User",
        preferences: { theme: "light", notifications: true },
      },
    });

    await Job.create({
      title: "Frontend Developer",
      description: "React dev",
      company: "Acme",
      salary: 3000,
      tags: ["react", "frontend"],
      owner: u._id,
    });

    await Job.create({
      title: "Backend Developer",
      description: "Node.js dev",
      company: "Acme",
      salary: 4000,
      tags: ["node", "backend"],
      owner: u._id,
    });

    console.log("✅ Seed completo. Usuário criado: demo@demo.com / 123456");
  } catch (err) {
    console.error("❌ Erro ao rodar o seed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
