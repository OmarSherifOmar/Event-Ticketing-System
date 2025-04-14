const express = require("express");
const { deleteUser, getAllUsers } = require("../controlers/UserController"); // Import deleteUser and getAllUsers

const router = express.Router();

// * Get all users route

router.get('/', getAllUsers);

// * Delete user route
router.delete('/:id', deleteUser);

module.exports = router; // Export the router