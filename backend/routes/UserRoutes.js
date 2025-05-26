const express = require("express");
const multer = require("multer");
const {
    getCurrentUserProfile,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    updateProfile,
    updateProfilePicture // <-- this must be exported!
} = require("../controlers/UserController");
const { getAnalytics, getUserEvent } = require("../controlers/EventController");
const authenticate = require("../middleware/authenticationMiddleware");
const booking = require("../controlers/bookingController");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const { topUpWallet } = require("../controlers/UserController");

const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Profile picture upload route (authenticated users only)
router.put(
  "/profile-picture",
  authenticate,
  upload.single("profilepicture"),
  updateProfilePicture
);

router.get("/events/analytics", authenticate, authorizationMiddleware(["Organizer"]), getAnalytics);

router.get("/events", authenticate, authorizationMiddleware(["Organizer"]), getUserEvent);

router.get("/bookings", authenticate, authorizationMiddleware(['Standard User']), booking.getMyBookings);

router.get('/profile', authenticate, getCurrentUserProfile);

router.put('/profile', authenticate, updateProfile);

router.get('/', authenticate, authorizationMiddleware(['System Admin']), getAllUsers);

router.get('/:id', authenticate, authorizationMiddleware(['System Admin']), getUserById);

router.put('/:id', authenticate, authorizationMiddleware(['System Admin']), updateUserRole);

router.delete('/:id', authenticate, authorizationMiddleware(['System Admin']), deleteUser);

// Top up wallet
router.post("/wallet/topup", authenticate, authorizationMiddleware(['Standard User']), topUpWallet);

module.exports = router;