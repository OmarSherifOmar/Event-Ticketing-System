const express = require("express");
const router = express.Router();
const { deleteUser, login, register, forgetPassword, resetPassword } = require("../controlers/UserController");

router.post("/login", login);

router.post("/register", register);

router.put("/forgetPassword", forgetPassword);

router.put('/resetpassword', resetPassword);

module.exports = router;