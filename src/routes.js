const express = require("express");
const router = express.Router();
const AuthController = require("./app/controllers/AuthController");
const UserController = require("./app/controllers/UserController");
const JobController = require("./app/controllers/JobController");
const auth = require("./app/middlewares/auth");
const ExternalJobController = require("./app/controllers/ExternalJobController");

// Auth
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.post("/auth/refresh", AuthController.refresh);
router.post("/auth/forgot-password", AuthController.forgotPassword);
router.post("/auth/reset-password", AuthController.resetPassword);
router.post("/auth/enable-2fa", auth, AuthController.enable2FA);
router.post("/auth/verify-2fa", auth, AuthController.verifyEnable2FA);

// Users
router.get("/users", auth, UserController.list);
router.get("/users/me", auth, UserController.me);
router.get("/users/:id", auth, UserController.get);
router.put("/users/:id", auth, UserController.update);
router.delete("/users/:id", auth, UserController.remove);

// Profile (kept inside users endpoints style)
router.get("/profile", auth, UserController.getProfile);
router.put("/profile", auth, UserController.updateProfile);

// Jobs
router.post("/jobs", auth, JobController.create);
router.get("/jobs", JobController.list);
router.get("/jobs/:id", JobController.get);
router.put("/jobs/:id", auth, JobController.update);
router.delete("/jobs/:id", auth, JobController.remove);

// Vagas externas (Remotive API)
router.get("/external-jobs", ExternalJobController.list);

// Search
router.get("/search", JobController.search);
router.get("/search/history", auth, JobController.searchHistory);

module.exports = router;
