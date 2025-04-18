const express = require("express");
const { 
    deleteUser, 
    getAllUsers, 
    updateUserRole, 
    getUserById, 
    getCurrentUserProfile, 
    updateProfile 
} = require("../controlers/UserController");
const authenticate = require("../middleware/authenticationMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware"); // Import authorizationMiddleware

const router = express.Router();

// Get current user's profile (Authenticated Users)
router.get('/profile', authenticate, getCurrentUserProfile);

// Update current user's profile (Authenticated Users)
router.put('/profile', authenticate, updateProfile);

// Get all users (Admin only)
router.get('/', authenticate, authorizationMiddleware(['System Admin']), getAllUsers);

// Get a single user by ID (Admin only)
router.get('/:id', authenticate, authorizationMiddleware(['System Admin']), getUserById);

// Update user's role (Admin only)
router.put('/:id', authenticate, authorizationMiddleware(['System Admin']), updateUserRole);

// Delete user (Admin only)
router.delete('/:id', authenticate, authorizationMiddleware(['System Admin']), deleteUser);

router.get("/analytics", authenticate, authorizationMiddleware(["Organizer"]), EventController.getAnalytics);

router.get("/events", authenticate, authorizationMiddleware(["Organizer"]), EventController.getUserEvent);

module.exports = router;