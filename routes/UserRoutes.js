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
} = require("../controlers/UserController");
const { getAnalytics, getUserEvent } = require("../controlers/EventController"); 
const authenticate = require("../middleware/authenticationMiddleware");
const booking = require("../controlers/bookingController"); 
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const router = express.Router();

router.get("/events/analytics", authenticate, authorizationMiddleware(["Organizer"]), getAnalytics);

router.get("/events", authenticate, authorizationMiddleware(["Organizer"]), getUserEvent);

router.get("/bookings", authenticate, authorizationMiddleware(['Standard User']), booking.getMyBookings);

router.get('/profile', authenticate, getCurrentUserProfile);

router.put('/profile', authenticate, updateProfile);

router.get('/', authenticate, authorizationMiddleware(['System Admin']), getAllUsers);

router.get('/:id', authenticate, authorizationMiddleware(['System Admin']), getUserById);

router.put('/:id', authenticate, authorizationMiddleware(['System Admin']), updateUserRole);

router.delete('/:id', authenticate, authorizationMiddleware(['System Admin']), deleteUser);

router.post('/forgotpassword', forgetPassword);

router.put('/resetpassword', resetPassword);

module.exports = router;