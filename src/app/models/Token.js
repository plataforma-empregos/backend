const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  type: String,
  token: String,
  expiresAt: Date,
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Token", TokenSchema);
