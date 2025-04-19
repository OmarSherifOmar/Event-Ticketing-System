const express = require("express");
const { deleteUser, getAllUsers, updateUserRole, getUserById, getCurrentUserProfile,forgetPassword,resetPassword } = require("../controlers/UserController");
const authenticate = require("../middleware/authentication");
const authorizationMiddleware = require("../middleware/authorization"); // Import authorizationMiddleware
const UserController = require("../controlers/UserController");  // Ensure correct path

const router = express.Router();

router.get('/profile', authenticate, getCurrentUserProfile);

// * Get all users route (System Admin only)
router.get('/', authenticate, authorizationMiddleware(['System Admin']), getAllUsers);

// * Get a single user by ID (System Admin only)
router.get('/:id', authenticate, authorizationMiddleware(['System Admin']), getUserById);

// * Update user's role route (System Admin only)
router.put('/:id', authenticate, authorizationMiddleware(['System Admin']), updateUserRole);

// * Delete user route (System Admin only)
router.delete('/:id', authenticate, authorizationMiddleware(['System Admin']), deleteUser);

// Forgot Password (keeps as POST since it's 
router.post('/forgetPassword',UserController.forgetPassword);
router.post('/resetPassword', UserController.resetPassword);
// * Get current user's profile (Authenticated Users)
module.exports = router;