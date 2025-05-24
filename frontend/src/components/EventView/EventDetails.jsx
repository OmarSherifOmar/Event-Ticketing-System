import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MdLocationOn, 
  MdAttachMoney, 
  MdEventAvailable, 
  MdDescription, 
  MdConfirmationNumber,
  MdEdit,
  MdDelete
} from "react-icons/md";
import EventButton from "../EventButton";
import Button from "../Button01.jsx";
import "../styles/EventButton.css";
import "../styles/EventDetails.css";
import "../styles/BookingStatus.css";

const API_URL = "http://localhost:5000/api/v1/events";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [user, setUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);

    // Fetch event data
    fetch(`${API_URL}/${id}`, { credentials: "include" })
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

  const handleEdit = () => {
    navigate(`/edit-event/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    setIsDeleting(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      navigate('/organizer-events');
    } catch (err) {
      console.error("Delete error:", err);
      setBookingStatus("Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!event || !user) {
    return (
      <div className="event-details-loading">
        Loading event...
      </div>
    );
  }

  const isOrganizeroradmin = (user.role === "Organizer"&&event.organizer==user._id||user.role === "System Admin");
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

        {/* Moved organizer controls here */}
        {isOrganizeroradmin && (
          <div className="organizer-controls" style={{ marginTop: '20px' }}>
            <Button 
              className="edit-event-btn"
              onClick={handleEdit}
            >
              <MdEdit /> Edit Event
            </Button>
            <Button 
              className="delete-event-btn"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <MdDelete /> {isDeleting ? "Deleting..." : "Delete Event"}
            </Button>
          </div>
        )}

        {event.remainingTickets > 0 && (
          <>
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
            <EventButton 
              onClick={() => handleBookNow(event._id)}
              disabled={tickets < 1 || tickets > event.remainingTickets}
            >
              Book Now
            </EventButton>
          </>
        )}

        {bookingStatus === "success" && <p className="booking-message success">Booking successful!</p>} 
        {bookingStatus && bookingStatus !== "loading" && bookingStatus !== "success" && (
          <p className="booking-message error">
            {bookingStatus === "Invalid token" ? "Please login to continue" : bookingStatus}
          </p>
        )}
      </div>
    </div>
  </div>
);
}

export default EventDetails;