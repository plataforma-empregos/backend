const { Router } = require('express');

const UserController = require('./app/controllers/UserController');
const AuthController = require('./app/controllers/AuthController');
const JobController = require('./app/controllers/JobController');

const authMiddleware = require('./app/middlewares/auth');

const routes = new Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestão de usuários
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
routes.post('/users', UserController.store);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação
 */

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Login de usuário
 *     description: Retorna um token JWT para autenticação.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@trampo.com
 *               password:
 *                 type: string
 *                 example: 12345
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 */

routes.post('/sessions', AuthController.login);

// Middleware de autenticação
routes.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Gestão de vagas
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Lista todas as vagas
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vagas retornada
 */
routes.get('/jobs', JobController.index);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Cria uma nova vaga
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vaga criada com sucesso
 */
routes.post('/jobs', JobController.store);

module.exports = routes;
