const express = require("express");
const router = express.Router();

const { login, register, forgetPassword, resetPassword, logout } = require("../controlers/UserController");

router.post("/login", login);
router.post("/register", register);
router.put("/forgetPassword", forgetPassword);
router.put('/resetpassword', resetPassword);
router.post("/logout", logout); 

module.exports = router;