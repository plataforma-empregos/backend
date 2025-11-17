const express = require("express");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./app/config/swagger");
const routes = require("./routes");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const joobleRoutes = require("./routes/jobRoutes");

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
app.use("/api", routes);
app.use("/api/jooble", joobleRoutes);

module.exports = app;
