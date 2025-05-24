import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookingSection.css";
import BookingDetails from "./BookingDetails";

const API_URL = "http://localhost:5000/api/v1";

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [message, setMessage] = useState("");

    useEffect(() => {
      const fetchBookings = async () => {
        setBookingLoading(true);
        setBookingError("");
        try {
          const token = localStorage.getItem("token");
          console.log(token)
          const res = await axios.get("http://localhost:5000/api/v1/users/bookings", {
            headers: { Authorization: `Bearer ${token}` } });
          setBookings(res.data);
        } catch (err) {
          setBookingError("Failed to fetch bookings.");
        } finally {
          setBookingLoading(false);
        }
      };
      fetchBookings();
    }, []);


    const handleCancelBooking = async (bookingId) => {
      if(window.confirm("Are you sure you want to cancel this booking?")) {
        try{
          const token = localStorage.getItem("token");
          
          await axios.delete(`http://localhost:5000/api/v1/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBookings((prevBookings) =>
            prevBookings.filter((booking) => booking._id !== bookingId)
          );
          setMessage("Booking canceled successfully.");
        } 
        catch (err) {
          setMessage("Failed to cancel booking.");
        }
     }
    };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="user-bookings-page">
      <h2>Your Bookings</h2>
      {message && <div className="profile-message">{message}</div>}
      {bookingLoading && <div>Loading bookings...</div>}
      {bookingError && <div className="profile-message error">{bookingError}</div>}
      {!bookingLoading && bookings.length === 0 && <div>No bookings found.</div>}
      <ul className="profile-bookings-list">
        {bookings.map((booking) => (
          <li key={booking._id} className="profile-booking-item">
            <div>
              <strong>Event:</strong> {booking.event?.title || "Event"}
            </div>
            <div>
              <strong>Tickets:</strong> {booking.numberOfTickets}
            </div>
            <div>
              <strong>Total Price:</strong> $
              {booking.totalPrice ||
                (booking.numberOfTickets * (booking.event?.ticketPricing || 0))}
            </div>
            <div>
              <strong>Status:</strong> {booking.bookingStatus}
            </div>
            <button
                className="profile-cancel-booking-btn"
                style={{ background: "#6e8efb", marginBottom: 8 }}
                onClick={() => setSelectedBooking(booking)}
                >
             View Details
            </button>
            {booking.bookingStatus === "Confirmed" && (
              <button
                className="profile-cancel-booking-btn"
                onClick={() => handleCancelBooking(booking._id)}
              >
                Cancel Booking
              </button>
            )}
          </li>
        ))}
      </ul>
      {selectedBooking && (
        <BookingDetails
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}