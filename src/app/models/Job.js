const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const JobSchema = new Schema({
  title: { type: String, text: true },
  description: { type: String, text: true },
  company: String,
  salary: Number,
  tags: [String],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});
JobSchema.index({ title: "text", description: "text", company: "text" });
module.exports = mongoose.model("Job", JobSchema);
