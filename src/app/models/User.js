const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    name: String,
    bio: String,
    preferences: {
      theme: { type: String, default: "dark" },
      notifications: { type: Boolean, default: true },
    },
  },
  { _id: false }
);

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, index: true, required: true },
  password: String,
  profile: ProfileSchema,
  refreshTokens: [{ token: String, createdAt: Date }],
  twoFA: { enabled: { type: Boolean, default: false }, secret: String },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
