const express = require("express");
const router = express.Router();

const {
  login,
  register,
  forgetPassword,
  resetPassword,
  logout,
  verifyMfa,
  enableMfa,
  disableMfa
} = require("../controlers/UserController");

const authenticate = require("../middleware/authenticationMiddleware");

router.post("/login", login);
router.post("/register", register);
router.put("/forgetPassword", forgetPassword);
router.put("/resetpassword", resetPassword);
router.post("/logout", logout);
router.post("/verify-mfa", verifyMfa);

// Protect MFA toggle routes with authentication
router.post("/enable-mfa", authenticate, enableMfa);
router.post("/disable-mfa", authenticate, disableMfa);

module.exports = router;