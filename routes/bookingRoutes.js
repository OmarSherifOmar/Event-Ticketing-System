const express = require('express');
const router = express.Router();
const bookingController = require('../controlers/bookingController');
const authenticate = require('../middleware/authenticationMiddleware');
const authorize = require('../middleware/authorizationMiddleware');

// Create a booking (Standard User)
router.post('/', authenticate, authorize(['Standard User']), bookingController.bookTickets);

router.get('/:bookingId', authenticate, authorize(['Standard User']), bookingController.getBookingByID);

// Cancel booking (Standard User)
router.delete('/:bookingId', authenticate, authorize(['Standard User']), bookingController.cancelBooking);

module.exports = router;
