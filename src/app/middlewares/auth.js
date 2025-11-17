const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/auth");

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.userId = payload.id;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
