module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  baseUrl: process.env.BASE_URL || 'http://localhost:3000'
};
