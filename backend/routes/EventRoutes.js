const express = require("express");
const EventController = require("../controlers/EventController"); 
const authenticate = require("../middleware/authenticationMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const router = express.Router();


router.get("/", EventController.getALLApprovedEvents);

router.get("/all", authenticate, authorizationMiddleware(["System Admin"]), EventController.getALLEvents);

router.post("/", authenticate, authorizationMiddleware(["Organizer"]), EventController.PostEvent);

router.get("/:id", EventController.getEvent);

router.put("/:id", authenticate, authorizationMiddleware(["Organizer", "System Admin"]), EventController.EditEvent);

router.delete("/:id", authenticate, authorizationMiddleware(["Organizer", "System Admin"]), EventController.DeleteEvent);


module.exports = router;