const express = require("express");
const EventController =require("../controlers/EventController");
const authorizationMiddleware=require('../middleware/authorizationMiddleware');
const router = express.Router();

router.get("/events",authorizationMiddleware(["Organizer","Standard User","System Admin"]),EventController.getALLEvents);
router.post("/events",authorizationMiddleware(["Organizer"]),EventController.PostEvent);
router.get("/events/:id",authorizationMiddleware(["Organizer","Standard User","System Admin"]),EventController.getEvent);
router.put("/events/:id",authorizationMiddleware(["Organizer","System Admin"]),EventController.EditEvent);
router.delete("/events/:id",authorizationMiddleware(["Organizer","System Admin"]),EventController.DeleteEvent);
router.get("/users/events", authorizationMiddleware(["Organizer"]), EventController.getUserEvents);
router.get("/users/events/analytics", authorizationMiddleware(["Organizer"]), EventController.getAnalytics);
module.exports=router ;