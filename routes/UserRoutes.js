const express = require("express");
const {
    getCurrentUserProfile,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    forgetPassword,
    resetPassword,
    updateProfile,
} = require("../controlers/UserController"); // Import user-related methods
const { getAnalytics, getUserEvent } = require("../controlers/EventController"); // Import analytics and user event methods
const authenticate = require("../middleware/authenticationMiddleware");
const booking = require("../controlers/bookingController"); // Import booking controller
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const router = express.Router();

// Get analytics for events (Organizer only)
router.get("/events/analytics", authenticate, authorizationMiddleware(["Organizer"]), getAnalytics);

// Get current user's events (Organizer only)
router.get("/events", authenticate, authorizationMiddleware(["Organizer"]), getUserEvent);

router.get("/bookings", authenticate, authorizationMiddleware(['Standard User']), booking.getMyBookings);

// Get current user's profile (Authenticated Users)
router.get('/profile', authenticate, getCurrentUserProfile);

// Update current user's profile (Authenticated Users)
router.put('/profile', authenticate, updateProfile);

// Get all users (System Admin only)
router.get('/', authenticate, authorizationMiddleware(['System Admin']), getAllUsers);

// Get a single user by ID (System Admin only)
router.get('/:id', authenticate, authorizationMiddleware(['System Admin']), getUserById);

// Update user's role (System Admin only)
router.put('/:id', authenticate, authorizationMiddleware(['System Admin']), updateUserRole);

// Delete a user (System Admin only)
router.delete('/:id', authenticate, authorizationMiddleware(['System Admin']), deleteUser);

// Forgot password (Public)
router.post('/forgotpassword', forgetPassword);

// Reset password (Public)
router.put('/resetpassword', resetPassword);

module.exports = router;