const router = require("express").Router();

const tutorialRoute = require("./Tutorial");

router.use("/tutorial", tutorialRoute);

module.exports = router;