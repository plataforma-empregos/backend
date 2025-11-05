const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/auth");
module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  const parts = auth.split(" ");
  if (parts.length !== 2)
    return res.status(401).json({ error: "Invalid token format" });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.userId = payload.id;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
