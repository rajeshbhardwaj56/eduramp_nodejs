
const express = require("express");
const {login, register} = require("../controllers/auth.controller")
const test = require("../middlewares/test.middleware")

const authRouter = express.Router();

authRouter.get("/", login)

authRouter.get("/login", test, register);

module.exports = authRouter