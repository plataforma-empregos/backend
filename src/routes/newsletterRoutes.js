const express = require("express");
const router = express.Router();

const newsletterController = require("../app/controllers/newsletterController");

// POST /api/newsletter
router.post("/", newsletterController.subscribe);

module.exports = router;
