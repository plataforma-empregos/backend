const express = require("express");
const router = express.Router();
const AuthController = require("./app/controllers/AuthController");
const UserController = require("./app/controllers/UserController");
const JobController = require("./app/controllers/JobController");
const auth = require("./app/middlewares/auth");
const ExternalJobController = require("./app/controllers/ExternalJobController");

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.post("/auth/logout", AuthController.logout);

router.get("/users", auth, UserController.list);
router.get("/users/me", auth, UserController.me);
router.get("/users/:id", auth, UserController.get);
router.put("/users/:id", auth, UserController.update);
router.delete("/users/:id", auth, UserController.remove);

router.get("/profile", auth, UserController.getProfile);
router.put("/profile", auth, UserController.updateProfile);

router.post("/jobs", auth, JobController.create);
router.get("/jobs", JobController.list);
router.get("/jobs/:id", JobController.get);
router.put("/jobs/:id", auth, JobController.update);
router.delete("/jobs/:id", auth, JobController.remove);

router.get("/external-jobs", ExternalJobController.list);

router.get("/external-jobs/:id", ExternalJobController.get);

router.get("/search", JobController.search);
router.get("/search/history", auth, JobController.searchHistory);

module.exports = router;
