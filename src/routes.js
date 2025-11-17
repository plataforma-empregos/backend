const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const AuthController = require("./app/controllers/AuthController");
const UserController = require("./app/controllers/UserController");
const JobController = require("./app/controllers/JobController");
const auth = require("./app/middlewares/auth");

router.post(
  "/auth/register",
  [
    body("email").isEmail().withMessage("E-mail inválido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Senha deve ter no mínimo 6 caracteres"),
    body("name").notEmpty().withMessage("Nome é obrigatório"),
  ],
  AuthController.register
);

router.post("/auth/login", AuthController.login);
router.post("/auth/logout", AuthController.logout);
router.post("/auth/google", AuthController.googleLogin); //Necessária para realizar o login com o Google
=======
router.post("/auth/google", AuthController.googleLogin); //Necessária para realizar o login com o Google

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

module.exports = router;
