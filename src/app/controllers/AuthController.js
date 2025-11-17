const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { jwtSecret, jwtExpiresIn, refreshExpiresIn } = require("../config/auth");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signToken(payload, expiresIn = jwtExpiresIn) {
  return jwt.sign(payload, jwtSecret, { expiresIn });
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 1000 * 60 * 60, // 1 hora de duração do cookie
};

module.exports = {
  async googleLogin(req, res) {
    const { token } = req.body; // Token JWT enviado pelo frontend

    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const email = payload.email;
      const name = payload.name;

      let user = await User.findOne({ email });

      if (!user) {
        const randomPassword = Math.random().toString(36).slice(-8);
        user = new User({
          email,
          name,
          password: randomPassword,
        });
        await user.save();
      }

      const access = signToken({ id: user._id });
      res.cookie("token", access, cookieOptions);

      return res.json({
        user: { id: user._id, email: user.email, name: user.name },
      });
    } catch (error) {
      console.error("Erro na verificação do Google:", error);
      return res.status(401).json({ error: "Token do Google inválido." });
    }
  },

  async register(req, res) {
    const { email, password, name } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "E-mail e senha são obrigatórios" });

    let exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: "Este e-mail já está cadastrado." });

    try {
      const user = new User({ email, password, name });
      await user.save();

      const access = signToken({ id: user._id });
      res.cookie("token", access, cookieOptions);

      const refresh = signToken(
        { id: user._id, type: "refresh" },
        refreshExpiresIn
      );
      user.refreshTokens.push({ token: refresh, createdAt: new Date() });
      await user.save();

      return res.status(201).json({
        user: { id: user._id, email: user.email, name: user.name },
      });
    } catch (err) {
      return res.status(500).json({ error: "Falha ao registrar usuário." });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

    const ok = await user.checkPassword(password);
    if (!ok) return res.status(401).json({ error: "Senha inválida" });

    const access = signToken({ id: user._id });
    res.cookie("token", access, cookieOptions);

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
};
