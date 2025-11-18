const express = require("express");
const router = express.Router();
const contactController = require("../app/controllers/contactController");

router.post("/", contactController.sendMessage);

module.exports = router;
