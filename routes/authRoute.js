
const express = require("express");
const router = express.Router();
const { deleteUser, login, register } = require("../controlers/UserController"); // Import deleteUser

// * Login route
router.post("/login", login);

// * Register route
router.post("/register", register);

// * Delete user route
//router.delete('/users/:id', deleteUser);

module.exports = router; // Export the router