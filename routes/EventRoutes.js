const express = require("express");
const EventController = require("../controlers/EventController"); // Ensure the path is correct
const authenticate = require("../middleware/authenticationMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const router = express.Router();

// Get all approved events (Accessible to all roles)
router.get("/", authenticate, authorizationMiddleware(["Organizer", "Standard User", "System Admin"]), EventController.getALLApprovedEvents);
// Get all events (Accessible to admin)
router.get("/all", authenticate, authorizationMiddleware(["System Admin"]), EventController.getALLEvents);
// Create a new event (Organizer only)
router.post("/", authenticate, authorizationMiddleware(["Organizer"]), EventController.PostEvent);

// Get a single event by ID (Accessible to all roles)
router.get("/:id", authenticate, authorizationMiddleware(["Organizer", "Standard User", "System Admin"]), EventController.getEvent);

// Edit an event (Organizer and System Admin only)
router.put("/:id", authenticate, authorizationMiddleware(["Organizer", "System Admin"]), EventController.EditEvent);

// Delete an event (Organizer and System Admin only)
router.delete("/:id", authenticate, authorizationMiddleware(["Organizer", "System Admin"]), EventController.DeleteEvent);


module.exports = router;