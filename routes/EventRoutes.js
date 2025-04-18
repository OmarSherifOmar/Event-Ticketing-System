const express = require("express");
const EventController = require("../controlers/EventController");
const authenticate = require("../middleware/authentication");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const router = express.Router();

// Get all events (Accessible to all roles)
router.get("/", authenticate, authorizationMiddleware(["Organizer", "Standard User", "System Admin"]), EventController.getALLEvents);

// Create a new event (Organizer only)
router.post("/", authenticate, authorizationMiddleware(["Organizer"]), EventController.PostEvent);

// Get a single event by ID (Accessible to all roles)
router.get("/:id", authenticate, authorizationMiddleware(["Organizer", "Standard User", "System Admin"]), EventController.getEvent);

// Edit an event (Organizer and System Admin only)
router.put("/:id", authenticate, authorizationMiddleware(["Organizer", "System Admin"]), EventController.EditEvent);

// Delete an event (Organizer and System Admin only)
router.delete("/:id", authenticate, authorizationMiddleware(["Organizer", "System Admin"]), EventController.DeleteEvent);

// Get events for the current user (Organizer only)
router.get("/users", authenticate, authorizationMiddleware(["Organizer"]), EventController.getUserEvent);

// Get analytics for events (Organizer only)
router.get("/users/analytics", authenticate, authorizationMiddleware(["Organizer"]), EventController.getAnalytics);

module.exports = router;