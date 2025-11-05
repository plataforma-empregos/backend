require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/trampomatch")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log("Server running on", PORT));
  })
  .catch((err) => {
    console.error("Mongo connection error", err);
    process.exit(1);
  });
