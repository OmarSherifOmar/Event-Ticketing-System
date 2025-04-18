const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 
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
  numberOfTickets: {
    type: Number,
    required: true 
  },
  BookedAt: {
    type: Date,
    default: Date.now
  },
bookingStatus:{
  type:String,
  enum: ['Canceled', 'Confirmed', 'Pending'],
  default: 'Pending'
},
totalPrice: {
  type: Number, 
  required: true
}

});