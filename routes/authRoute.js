const express = require("express");
const router = express.Router();
const { deleteUser, login, register, forgetPassword } = require("../controlers/UserController"); // Import forgetPassword

// * Login route
router.post("/login", login);

// * Register route
router.post("/register", register);

// * Forget password route (Public)
router.put("/forgetPassword", forgetPassword);

// * Delete user route (Optional, commented out)
// router.delete('/users/:id', deleteUser);

module.exports = router; // Export the router