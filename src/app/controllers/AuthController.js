const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const transporter = require("../config/mailer");
const User = require("../models/User");
const Token = require("../models/Token");
const {
  jwtSecret,
  jwtExpiresIn,
  refreshExpiresIn,
  baseUrl,
} = require("../config/auth");

function signToken(payload, expiresIn = jwtExpiresIn) {
  return jwt.sign(payload, jwtSecret, { expiresIn });
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
};

module.exports = {
  async register(req, res) {
    const { email, password, name } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password required" });
    let exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User exists" });
    const user = new User({ email, password, name });
    await user.save();

    const access = signToken({ id: user._id });

    res.cookie("token", access, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24,
    });

    const refresh = signToken(
      { id: user._id, type: "refresh" },
      refreshExpiresIn
    );
    user.refreshTokens.push({ token: refresh, createdAt: new Date() });
    await user.save();

    return res.json({
      user: { id: user._id, email: user.email, name: user.name },
    });
  },

  async login(req, res) {
    const { email, password, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });
    const ok = await user.checkPassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid password" });

    const access = signToken({ id: user._id });

    res.cookie("token", access, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24,
    });

    const refresh = signToken(
      { id: user._id, type: "refresh" },
      refreshExpiresIn
    );
    user.refreshTokens.push({ token: refresh, createdAt: new Date() });
    await user.save();

    return res.json({
      user: { id: user._id, email: user.email, name: user.name },
    });
  },

  async logout(req, res) {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.status(200).json({ ok: true });
  },

  // ... (O resto do seu AuthController.js (refresh, forgotPassword, etc.)
  // precisaria ser refatorado também, mas 'login' e 'register' são o bastante
  // para fazer o frontend funcionar.)
};
