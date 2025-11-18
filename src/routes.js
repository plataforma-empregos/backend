const express = require("express");
const { param } = require("express-validator");
const router = express.Router();

const ExternalJobController = require("./app/controllers/ExternalJobController");
const AuthController = require("./app/controllers/AuthController");
const UserController = require("./app/controllers/UserController");
const JobController = require("./app/controllers/JobController");
const auth = require("./app/middlewares/auth");

// Rotas de autenticação
router.post(
  "/auth/register",
  AuthController.validateRegister,
  AuthController.register
);
router.post("/auth/login", AuthController.validateLogin, AuthController.login);
router.post("/auth/logout", AuthController.logout);
router.post("/auth/google", AuthController.googleLogin); // Login com Google

//Token Refresh
router.post("/auth/refresh", AuthController.refreshToken);

// Rotas de usuários
router.get("/users", auth, UserController.list);
router.get(
  "/users/:id",
  [param("id").isMongoId().withMessage("ID inválido")],
  auth,
  UserController.get
);
router.put("/users/:id", auth, UserController.update);
router.delete("/users/:id", auth, UserController.remove);

// Rotas de perfil
router.get("/profile", auth, UserController.getProfile);
router.put("/profile", auth, UserController.updateProfile);

// Rotas de empregos
router.post("/jobs", auth, JobController.create);
router.get("/jobs", JobController.list);
router.get("/jobs/:id", JobController.get);
router.put("/jobs/:id", auth, JobController.update);
router.delete("/jobs/:id", auth, JobController.remove);

// Rotas de vagas externas (JSearch)
router.get("/external-jobs", ExternalJobController.list);
router.get("/external-jobs/:id", ExternalJobController.get);

module.exports = router;
