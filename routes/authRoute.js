const express = require("express");
const router = express.Router();
const { deleteUser, login, register, forgetPassword } = require("../controlers/UserController");

router.post("/login", login);

router.post("/register", register);

router.put("/forgetPassword", forgetPassword);

module.exports = router;