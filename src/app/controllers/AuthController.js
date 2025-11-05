/**
 * @swagger
 * tags:
 *  - name: Auth
 *    description: Authentication endpoints
 */
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const speakeasy = require("speakeasy");
const transporter = require("../config/mailer");
const User = require("../models/User");
const Token = require("../models/Token"); // Token model created below in models folder
const {
  jwtSecret,
  jwtExpiresIn,
  refreshExpiresIn,
  baseUrl,
} = require("../config/auth");

function signToken(payload, expiresIn = jwtExpiresIn) {
  return jwt.sign(payload, jwtSecret, { expiresIn });
}

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
    const refresh = signToken(
      { id: user._id, type: "refresh" },
      refreshExpiresIn
    );
    user.refreshTokens.push({ token: refresh, createdAt: new Date() });
    await user.save();
    return res.json({
      user: { id: user._id, email: user.email, name: user.name },
      access,
      refresh,
    });
  },

  async login(req, res) {
    const { email, password, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });
    const ok = await user.checkPassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid password" });
    if (user.twoFA && user.twoFA.enabled) {
      if (!otp) return res.status(401).json({ error: "OTP required" });
      const validated = speakeasy.totp.verify({
        secret: user.twoFA.secret,
        encoding: "base32",
        token: otp,
      });
      if (!validated) return res.status(401).json({ error: "Invalid OTP" });
    }
    const access = signToken({ id: user._id });
    const refresh = signToken(
      { id: user._id, type: "refresh" },
      refreshExpiresIn
    );
    user.refreshTokens.push({ token: refresh, createdAt: new Date() });
    await user.save();
    return res.json({
      user: { id: user._id, email: user.email, name: user.name },
      access,
      refresh,
    });
  },

  async refresh(req, res) {
    const { refresh } = req.body;
    if (!refresh) return res.status(400).json({ error: "refresh required" });
    try {
      const payload = jwt.verify(refresh, jwtSecret);
      if (payload.type !== "refresh")
        return res.status(400).json({ error: "invalid token type" });
      const user = await User.findById(payload.id);
      if (!user) return res.status(401).json({ error: "user not found" });
      const found = user.refreshTokens.find((r) => r.token === refresh);
      if (!found)
        return res.status(401).json({ error: "refresh not recognized" });
      user.refreshTokens = user.refreshTokens.filter(
        (r) => r.token !== refresh
      );
      const newAccess = signToken({ id: user._id });
      const newRefresh = signToken(
        { id: user._id, type: "refresh" },
        refreshExpiresIn
      );
      user.refreshTokens.push({ token: newRefresh, createdAt: new Date() });
      await user.save();
      return res.json({ access: newAccess, refresh: newRefresh });
    } catch (e) {
      return res.status(401).json({ error: "invalid refresh token" });
    }
  },

  async forgotPassword(req, res) {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ ok: true });
    const token = crypto.randomBytes(32).toString("hex");
    const TokenModel = require("../models/Token");
    await TokenModel.create({
      user: user._id,
      type: "reset",
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });
    const link = `${baseUrl}/api/auth/reset-password?token=${token}`;
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password reset",
        text: `Use this link to reset password: ${link}`,
      });
    } catch (e) {
      console.log("email send failed", e && e.message);
    }
    return res.json({ ok: true });
  },

  async resetPassword(req, res) {
    const { token, password } = req.body;
    const TokenModel = require("../models/Token");
    const dbt = await TokenModel.findOne({ token, type: "reset", used: false });
    if (!dbt || dbt.expiresAt < new Date())
      return res.status(400).json({ error: "invalid or expired token" });
    const user = await User.findById(dbt.user);
    if (!user) return res.status(400).json({ error: "user not found" });
    user.password = password;
    await user.save();
    dbt.used = true;
    await dbt.save();
    return res.json({ ok: true });
  },

  async enable2FA(req, res) {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "user not found" });
    const secret = speakeasy.generateSecret({ length: 20 });
    user.twoFA = { enabled: false, secret: secret.base32 };
    await user.save();
    return res.json({ otpauth_url: secret.otpauth_url, base32: secret.base32 });
  },

  async verifyEnable2FA(req, res) {
    const { token } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "user not found" });
    const ok = speakeasy.totp.verify({
      secret: user.twoFA.secret,
      encoding: "base32",
      token,
    });
    if (!ok) return res.status(400).json({ error: "invalid token" });
    user.twoFA.enabled = true;
    await user.save();
    return res.json({ ok: true });
  },
};
