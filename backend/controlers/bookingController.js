const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');

exports.bookTickets = async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event || event.status !== 'approved')
      return res.status(404).json({ message: 'Event not found or not approved' });

    if (event.remainingTickets < numberOfTickets)
      return res.status(400).json({ message: 'Not enough tickets available' });

    const totalPrice = numberOfTickets * event.ticketPricing;

    // Fetch user and check wallet
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.wallet < totalPrice) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Deduct from wallet
    user.wallet -= totalPrice;
    await user.save();

    const booking = await Booking.create({
      user: userId,
      event: eventId,
      numberOfTickets,
      totalPrice,
      bookingStatus: 'Confirmed',
    });

    event.remainingTickets -= numberOfTickets;
    await event.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Booking failed', error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.bookingId, user: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.bookingStatus === 'Canceled')
      return res.status(400).json({ message: 'Booking already canceled' });

    // Refund wallet
    const user = await User.findById(req.user.id);
    if (user) {
      user.wallet += booking.totalPrice;
      await user.save();
    }

    booking.bookingStatus = 'Canceled';
    await booking.save();

    const event = await Event.findById(booking.event);
    event.remainingTickets += booking.numberOfTickets;
    await event.save();

    res.json({ message: 'Booking canceled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error canceling booking', error: err.message });
  }
};

exports.getBookingByID = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.bookingId, user: req.user.id }).populate('event');
    if (!booking) return res.status(404).json({ message: 'Booking not found or belongs to a different user' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching booking', error: err.message });
  }
}

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    console.log('User ID:', req.user._id);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
};
