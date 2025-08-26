require('dotenv').config();

module.exports = {
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_STORAGE || './src/database/database.sqlite',
  logging: false,
};
