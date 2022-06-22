const router = require("express").Router();

const tutorialRoute = require("./Tutorial");
const authRoute = require("./api/UserManagement/authentication");
const externalRoute = require("./external/BonSementara");

router.use("/auth", authRoute);
router.use("/tutorial", tutorialRoute);
router.use("/external", externalRoute);

module.exports = router;
