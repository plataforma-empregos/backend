// src/app/config/swaggerDocs.js

/**
 * @openapi
 *
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       '200':
 *         description: Usuário criado com tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/UserPublic'
 *                 access: { type: string }
 *                 refresh: { type: string }
 *
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login do usuário (retorna access + refresh)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: Login bem sucedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Troca refresh token (rotaciona)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh: { type: string }
 *     responses:
 *       '200':
 *         description: Novos tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Envia email com link único para resetar senha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *     responses:
 *       '200':
 *         description: OK
 *
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reseta a senha usando token de reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token: { type: string }
 *               password: { type: string }
 *     responses:
 *       '200':
 *         description: Senha alterada
 *
 * /auth/enable-2fa:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Inicia ativação de 2FA (gera secret)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Retorna otpauth_url e base32 do secret
 *
 * /auth/verify-2fa:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verifica token TOTP e ativa 2FA
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token: { type: string }
 *     responses:
 *       '200':
 *         description: 2FA ativada
 *
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Lista usuários (página + filtros)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       '200':
 *         description: Lista paginada
 *
 * /users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Dados do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Usuário atual
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPublic'
 *
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Consulta usuário por id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       '200':
 *         description: Usuário encontrado
 *
 *   put:
 *     tags:
 *       - Users
 *     summary: Atualiza usuário (admin / dono)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Usuário atualizado
 *
 *   delete:
 *     tags:
 *       - Users
 *     summary: Remove usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       '200':
 *         description: Usuario removido
 *
 * /profile:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Retorna o profile do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Profile do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *
 *   put:
 *     tags:
 *       - Profile
 *     summary: Atualiza/Cria profile do usuário
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       '200':
 *         description: Profile salvo
 *
 * /jobs:
 *   post:
 *     tags:
 *       - Jobs
 *     summary: Cria uma vaga (autenticado)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               company: { type: string }
 *               salary: { type: number }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       '200':
 *         description: Vaga criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Lista vagas com filtros e paginação
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: tags
 *         schema: { type: string }
 *       - in: query
 *         name: minSalary
 *         schema: { type: number }
 *       - in: query
 *         name: maxSalary
 *         schema: { type: number }
 *     responses:
 *       '200':
 *         description: Listagem de vagas
 *
 * /jobs/{id}:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Consulta vaga por id (com métricas)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       '200':
 *         description: Vaga detalhada (inclui metrics)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *                 metrics:
 *                   type: object
 *                   properties:
 *                     countSameCompany: { type: integer }
 *
 *   put:
 *     tags:
 *       - Jobs
 *     summary: Atualiza vaga (apenas dono)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Vaga atualizada
 *
 *   delete:
 *     tags:
 *       - Jobs
 *     summary: Remove vaga (apenas dono)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       '200':
 *         description: Vaga removida
 *
 * /search:
 *   get:
 *     tags:
 *       - Search
 *     summary: Busca full-text em jobs (registra histórico quando autenticado)
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       '200':
 *         description: Resultados da busca
 *
 * /search/history:
 *   get:
 *     tags:
 *       - Search
 *     summary: Histórico de buscas do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de termos buscados
 * 
 * /external-jobs:
 *   get:
 *     tags:
 *       - External Jobs
 *     summary: Listar vagas externas da API pública JSearch
 *     description: >
 *       Retorna vagas reais de tecnologia obtidas da API pública JSearch (via RapidAPI).  
 *       Os resultados incluem título, empresa, descrição, localidade, tipo de contrato e link de candidatura.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: "Número da página (início em 1)"
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: "Quantidade de vagas por página"
 *     responses:
 *       '200':
 *         description: "Lista de vagas externas retornadas da API pública"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 200
 *                   description: "Total de vagas encontradas"
 *                 page:
 *                   type: integer
 *                   example: 1
 *                   description: "Página atual"
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                   description: "Quantidade de vagas por página"
 *                 data:
 *                   type: array
 *                   description: "Lista de vagas normalizadas"
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Backend Developer"
 *                         description: "Título da vaga"
 *                       company:
 *                         type: string
 *                         example: "Google"
 *                         description: "Nome da empresa"
 *                       description:
 *                         type: string
 *                         example: "Responsável por desenvolver APIs REST usando Node.js e MongoDB."
 *                         description: "Descrição da vaga"
 *                       location:
 *                         type: string
 *                         example: "Brazil"
 *                         description: "Localidade ou formato de trabalho (exemplo: remoto)"
 *                       salary:
 *                         type: string
 *                         example: "USD"
 *                         description: "Moeda ou valor informado"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Full-Time", "JSearch"]
 *                         description: "Tags associadas à vaga"
 *                       externalLink:
 *                         type: string
 *                         example: "https://www.example.com/job/12345"
 *                         description: "Link direto para candidatura"
 *                       source:
 *                         type: string
 *                         example: "JSearch API"
 *                         description: "Fonte de onde a vaga foi obtida"
 *       '500':
 *         description: "Erro ao buscar vagas externas"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Falha ao buscar vagas externas"
 */
