const router = require("express").Router();

const tutorialRoute = require("./Tutorial");
const authRoute = require("./api/UserManagement/authentication");
const menuRoute = require("./api/UserManagement/menu");
const resourceRoute = require("./api/UserManagement/resource");
const externalRoute = require("./external/BonSementara");
const positionRoute = require("./api/UserManagement/position");

router.use("/auth", authRoute);
router.use("/menu", menuRoute);
router.use("/resource", resourceRoute);
router.use("/position", positionRoute);
router.use("/tutorial", tutorialRoute);
router.use("/external", externalRoute);

module.exports = router;
