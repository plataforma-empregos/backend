const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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

const RefreshTokenSchema = new Schema(
  {
    token: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserSchema = new Schema({
  name: { type: String, required: [true, "Nome é obrigatório"] },
  email: {
    type: String,
    unique: true,
    index: true,
    required: [true, "E-mail é obrigatório"],
    match: [/.+\@.+\..+/, "E-mail inválido"],
  },
  password: {
    type: String,
    required: [true, "Senha é obrigatória"],
    minlength: [6, "A senha deve ter no mínimo 6 caracteres"],
  },
  profile: ProfileSchema,
  refreshTokens: [RefreshTokenSchema],
  twoFA: {
    enabled: { type: Boolean, default: false },
    secret: { type: String, default: null },
  },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && !this.password.startsWith("$2a$")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.addRefreshToken = async function (token) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  this.removeExpiredTokens(); // limpa tokens antigos antes de adicionar
  this.refreshTokens.push({ token: hashedToken, createdAt: new Date() });
  await this.save();
};

UserSchema.methods.checkRefreshToken = function (token) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const now = new Date();
  return this.refreshTokens.some((t) => {
    const age = now - new Date(t.createdAt);
    return t.token === hashedToken && age <= 60 * 60 * 1000; // 1 hora
  });
};

UserSchema.methods.removeExpiredTokens = function () {
  const now = new Date();
  this.refreshTokens = this.refreshTokens.filter(
    (t) => now - new Date(t.createdAt) <= 60 * 60 * 1000 // 1 hora
  );
};

UserSchema.methods.updateProfile = async function (profileData) {
  this.profile = { ...this.profile, ...profileData };
  await this.save();
};

module.exports = mongoose.model("User", UserSchema);
