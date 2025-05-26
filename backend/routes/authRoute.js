const express = require("express");
const router = express.Router();

const { login, register, forgetPassword, resetPassword, logout, verifyMfa,
    enableMfa} = require("../controlers/UserController");

router.post("/login", login);
router.post("/register", register);
router.put("/forgetPassword", forgetPassword);
router.put('/resetpassword', resetPassword);
router.post("/logout", logout); 
router.post("/verify-mfa", verifyMfa);
router.post("/enable-mfa", enableMfa);

module.exports = router;