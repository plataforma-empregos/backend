const jwt = require("jsonwebtoken");
<<<<<<< Updated upstream
const User = require("../models/User");
const { jwtSecret, jwtExpiresIn, refreshExpiresIn } = require("../config/auth");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
=======
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { jwtSecret, jwtExpiresIn, refreshExpiresIn } = require("../config/auth");
const { OAuth2Client } = require("google-auth-library");
>>>>>>> Stashed changes

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Função para gerar tokens JWT
function signToken(payload, expiresIn = jwtExpiresIn) {
  return jwt.sign(payload, jwtSecret, { expiresIn });
}

// Opções de cookies
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
<<<<<<< Updated upstream
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
=======
  maxAge: 1000 * 60 * 60, // Validade do Token
};

// Validação de entrada de dados
const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  googleLogin: [
    validate([body("token").notEmpty().withMessage("Token é obrigatório")]),
    async (req, res) => {
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
  ],

  register: [
    validate([
      body("email").isEmail().withMessage("E-mail inválido"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Senha deve ter no mínimo 6 caracteres"),
      body("name").notEmpty().withMessage("Nome é obrigatório"),
    ]),
    async (req, res) => {
      const { email, password, name } = req.body;

      try {
        let exists = await User.findOne({ email });
        if (exists) {
          return res
            .status(400)
            .json({ error: "Este e-mail já está cadastrado." });
        }

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
        console.error("Erro ao registrar usuário:", err);
        return res.status(500).json({ error: "Falha ao registrar usuário." });
      }
    },
  ],

  login: [
    validate([
      body("email").isEmail().withMessage("E-mail inválido"),
      body("password").notEmpty().withMessage("Senha é obrigatória"),
    ]),
    async (req, res) => {
      const { email, password } = req.body;

      try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const ok = await user.checkPassword(password);
        if (!ok) {
          return res.status(401).json({ error: "Credenciais inválidas" });
        }

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
      } catch (err) {
        console.error("Erro ao fazer login:", err);
        return res.status(500).json({ error: "Erro interno do servidor." });
      }
    },
  ],

  logout: async (req, res) => {
    try {
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  },
>>>>>>> Stashed changes
};
