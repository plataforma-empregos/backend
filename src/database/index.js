const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../app/models/User');
const Job = require('../app/models/Job');

const connection = new Sequelize(dbConfig);

User.init(connection);
Job.init(connection);

module.exports = connection;
