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
  bookingDate: {
    type: Date,
    default: Date.now
  },
  numberOfTickets: {
    type: Number,
    required: true
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

},{ timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
async function testBooking() {
  try {
    await mongoose.connect('mongodb://localhost:27017/event-ticketing', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const newBooking = new Booking({
      user: new mongoose.Types.ObjectId(), 
      event: new mongoose.Types.ObjectId(), 
      numberOfTickets: 2
    });

    await newBooking.save();
    console.log("Booking added:", newBooking);
  } catch (error) {
    console.error("Error adding booking:", error);
  } finally {
    mongoose.connection.close();
  }
}

testBooking();