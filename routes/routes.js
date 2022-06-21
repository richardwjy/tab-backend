const express = require("express");

const Router = express.Router();

const authRoute = require("./api/UserManagement/authentication");
Router.use("/auth", authRoute);

module.exports = Router;
