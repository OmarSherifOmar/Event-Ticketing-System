import React from "react";
import "./BookingSection.css";

export default function BookingDetails({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div className="booking-details-modal-overlay" onClick={onClose}>
      <div className="booking-details-modal" onClick={e => e.stopPropagation()}>
        <button className="booking-details-close-btn" onClick={onClose}>×</button>
        <h3>Booking Details</h3>
        <div className="booking-details-row"><strong>Event:</strong> {booking.event?.title}</div>
        <div className="booking-details-row"><strong>Date:</strong> {booking.event?.date ? new Date(booking.event.date).toLocaleString() : "N/A"}</div>
        <div className="booking-details-row"><strong>Location:</strong> {booking.event?.location}</div>
        <div className="booking-details-row"><strong>Tickets:</strong> {booking.numberOfTickets}</div>
        <div className="booking-details-row"><strong>Total Price:</strong> ${booking.totalPrice || (booking.numberOfTickets * (booking.event?.ticketPricing || 0))}</div>
        <div className="booking-details-row"><strong>Status:</strong> {booking.bookingStatus}</div>
        <div className="booking-details-row"><strong>Booked At:</strong> {booking.BookedAt ? new Date(booking.BookedAt).toLocaleString(undefined, {}) : "N/A"}</div>
      </div>
    </div>
  );
}