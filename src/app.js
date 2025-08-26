const express = require('express');
const routes = require('./routes');
require('./database');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
