const router = require("express").Router();

const tutorialRoute = require("./Tutorial");
const authRoute = require("./api/UserManagement/authentication");

router.use("/auth", authRoute);
router.use("/tutorial", tutorialRoute);


module.exports = router;
