const express = require("express");
const { deleteUser, getAllUsers, updateUserRole, getUserById, getCurrentUserProfile } = require("../controlers/UserController");
const authenticate = require("../middleware/authentication");
const authorizationMiddleware = require("../middleware/authorization"); // Import authorizationMiddleware

const router = express.Router();

// * Get current user's profile (Authenticated Users)
router.get('/profile', authenticate, getCurrentUserProfile);

// * Get all users route (System Admin only)
router.get('/', authenticate, authorizationMiddleware(['System Admin']), getAllUsers);

// * Get a single user by ID (System Admin only)
router.get('/:id', authenticate, authorizationMiddleware(['System Admin']), getUserById);

// * Update user's role route (System Admin only)
router.put('/:id', authenticate, authorizationMiddleware(['System Admin']), updateUserRole);

// * Delete user route (System Admin only)
router.delete('/:id', authenticate, authorizationMiddleware(['System Admin']), deleteUser);

module.exports = router;