const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authConfig = require('../../config/auth');

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Usa o método que criamos no Model
    const passwordMatched = await user.checkPassword(password);

    if (!passwordMatched) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    const { id, name } = user;

    return res.json({
      user: { id, name, email },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

module.exports = new AuthController();
