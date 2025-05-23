import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdLocationOn, MdAttachMoney, MdEventAvailable, MdDescription, MdConfirmationNumber } from "react-icons/md";
import EventButton from "../EventButton";
import "../styles/EventButton.css";
import "../styles/EventDetails.css";
import "../styles/BookingStatus.css";

const API_URL = "http://localhost:5000/api/v1/events";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [bookingStatus, setBookingStatus] = useState(null);
useEffect(() => {
  fetch(`${API_URL}/${id}`, { credentials: "include"})
    .then(res => res.json())
    .then(data => {
      console.log("Fetched event:", data);
      setEvent(data);
    })
    .catch(err => console.error("Error fetching event:", err));
}, [id]);

const handleBookNow = async (eventId) => {
  setBookingStatus("loading");
  const token = localStorage.getItem("token"); 
  try {
    const response = await fetch("http://localhost:5000/api/v1/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        eventId: eventId,
        numberOfTickets: tickets,
      }),
      credentials: "include",
    });
    if (!response.ok) {
      const error = await response.json();
      setBookingStatus(error.message || "Booking failed");
    } else {
      setBookingStatus("success");
    }
  } catch (err) {
    setBookingStatus("Booking failed");
  }
};

  if (!event) {
    return (
      <div className="event-details-loading">
        Loading event...
      </div>
    );
  }

  // Fix image URL if missing protocol
  const imageUrl = event.image?.startsWith("http") ? event.image : `https://${event.image}`;

  return (
    <div className="event-details-page">
      <div className="event-details-card">
        <img className="event-details-image" src={imageUrl} alt={event.title || "Event"} />
        <div className="event-details-info">
          <h1>{event.title || "No Title"}</h1>
          <div className="event-details-row">
            <MdLocationOn className="details-icon" />
            <span>{event.location || "No Location"}</span>
          </div>
          <div className="event-details-row">
            <MdEventAvailable className="details-icon" />
            <span>
              {event.date ? new Date(event.date).toLocaleString() : "Date not available"}
            </span>
          </div>
          <div className="event-details-row">
            <MdAttachMoney className="details-icon" />
            <span className="event-details-price">
              {event.ticketPricing !== undefined && event.ticketPricing !== null ? `$${event.ticketPricing}` : "No Price"}
            </span>
          </div>
          <div className="event-details-row">
            <MdConfirmationNumber className="details-icon" />
            <span>
              {event.remainingTickets === 0 ? "Sold Out" : event.remainingTickets <= 5 ? `Only ${event.remainingTickets} left!` : `${event.remainingTickets} ticket(s) left`}
            </span>
          </div>
          
          <div className="event-details-row">
            <MdDescription className="details-icon" />
            <span>{event.description || "No Description"}</span>
          </div>
         {event.remainingTickets > 0 && (
          <div className="event-details-row">
            <label>
              Tickets:
              <input
                type="number"
                min="1"
                max={event.remainingTickets || 1}
                value={tickets}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > event.remainingTickets)
                    setTickets(event.remainingTickets);
                  else if (val < 1)
                    setTickets(1);
                  else
                    setTickets(val);
                  }} 
                className="event-details-tickets-input"
                />
            </label>
            <span style={{ marginLeft: "1rem", fontWeight: 500}}>
              Total: ${event.ticketPricing !== undefined && event.ticketPricing !== null ? (tickets * event.ticketPricing).toFixed(2) : "0.00"}
            </span>
          </div>
          )}
          {event.remainingTickets > 0 && (
          <EventButton onClick={() => handleBookNow(event._id)}
          disabled={tickets < 1 || tickets > event.remainingTickets}>
            Book Now
          </EventButton>
          )}
          {bookingStatus === "success" && <p className="booking-message success">Booking successful!</p>} 
          {bookingStatus && bookingStatus !== "loading" && bookingStatus !== "success" && (
            <p className="booking-message error">{bookingStatus === "Invalid token" ? "Please login to continue" : bookingStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;