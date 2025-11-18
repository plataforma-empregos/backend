const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const { jwtSecret, jwtExpiresIn, refreshExpiresIn } = require("../config/auth");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signToken(payload, expiresIn = jwtExpiresIn) {
  return jwt.sign(payload, jwtSecret, { expiresIn });
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 1000 * 60 * 60, // 1 hora
};

const validateRegister = [
  body("email").isEmail().withMessage("E-mail inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("A senha deve ter no mínimo 6 caracteres"),
  body("name").notEmpty().withMessage("Nome é obrigatório"),
];

const validateLogin = [
  body("email").isEmail().withMessage("E-mail inválido"),
  body("password").notEmpty().withMessage("Senha é obrigatória"),
];

module.exports = {
  validateRegister,
  validateLogin,

  async googleLogin(req, res) {
    const { token } = req.body;

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
        const randomPassword = crypto.randomBytes(8).toString("hex");
        user = new User({ email, name, password: randomPassword });
        await user.save();
      }

      const access = signToken({ id: user._id });
      const refresh = signToken(
        { id: user._id, type: "refresh" },
        refreshExpiresIn
      );

      await user.addRefreshToken(refresh);
      res.cookie("token", access, cookieOptions);

      return res.json({
        user: { id: user._id, email: user.email, name: user.name },
        refreshToken: refresh,
      });
    } catch (error) {
      console.error("Erro na verificação do Google:", error);
      return res.status(401).json({ error: "Token do Google inválido." });
    }
  },

  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    let exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Este e-mail já está cadastrado." });
    }

    try {
      const user = new User({ email, password, name });
      await user.save();

      const access = signToken({ id: user._id });
      const refresh = signToken(
        { id: user._id, type: "refresh" },
        refreshExpiresIn
      );

      await user.addRefreshToken(refresh);
      res.cookie("token", access, cookieOptions);

      return res.status(201).json({
        user: { id: user._id, email: user.email, name: user.name },
        refreshToken: refresh,
      });
    } catch (err) {
      return res.status(500).json({ error: "Falha ao registrar usuário." });
    }
  },

  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

    const ok = await user.checkPassword(password);
    if (!ok) return res.status(401).json({ error: "Senha inválida" });

    const access = signToken({ id: user._id });
    const refresh = signToken(
      { id: user._id, type: "refresh" },
      refreshExpiresIn
    );

    await user.addRefreshToken(refresh);
    res.cookie("token", access, cookieOptions);

    return res.json({
      user: { id: user._id, email: user.email, name: user.name },
      refreshToken: refresh,
    });
  },

  async refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token é obrigatório." });
    }

    try {
      const decoded = jwt.verify(refreshToken, jwtSecret);
      if (decoded.type !== "refresh") {
        return res.status(401).json({ error: "Token inválido." });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ error: "Usuário não encontrado." });
      }

      const valid = user.checkRefreshToken(refreshToken);
      if (!valid) {
        return res
          .status(401)
          .json({ error: "Refresh token expirado ou inválido." });
      }

      const newAccess = signToken({ id: user._id });
      res.cookie("token", newAccess, cookieOptions);

      return res.json({ accessToken: newAccess });
    } catch (err) {
      return res.status(401).json({ error: "Falha na verificação do token." });
    }
  },

  async logout(req, res) {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.status(200).json({ ok: true });
  },
};
