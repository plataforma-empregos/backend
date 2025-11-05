const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SearchHistory = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  query: String,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("SearchHistory", SearchHistory);
