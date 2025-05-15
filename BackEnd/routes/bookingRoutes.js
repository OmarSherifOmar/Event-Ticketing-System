const express = require('express');
const router = express.Router();
const bookingController = require('../controlers/bookingController');
const authenticate = require('../middleware/authenticationMiddleware');
const authorize = require('../middleware/authorizationMiddleware');

router.post('/', authenticate, authorize(['Standard User']), bookingController.bookTickets);

router.get('/:bookingId', authenticate, authorize(['Standard User']), bookingController.getBookingByID);

router.delete('/:bookingId', authenticate, authorize(['Standard User']), bookingController.cancelBooking);

module.exports = router;
