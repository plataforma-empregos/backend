const express = require("express");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./app/config/swagger");
const routes = require("./routes");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const joobleRoutes = require("./routes/jobRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const contactRoutes = require("./routes/contactRoutes"); // ✅ NOVO

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas principais agrupadas
app.use("/api", routes);

// Outras rotas específicas
app.use("/api/jooble", joobleRoutes);

// Newsletter
app.use("/api/newsletter", newsletterRoutes);

// Contate-nos
app.use("/api/contact", contactRoutes); // ✅ NOVO

module.exports = app;
