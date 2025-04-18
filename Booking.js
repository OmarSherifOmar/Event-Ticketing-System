const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Booking schema
const bookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  numberOfTickets: {
    type: Number,
    required: true
  }
});
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
