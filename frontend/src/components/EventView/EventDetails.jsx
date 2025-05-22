import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdLocationOn, MdAttachMoney, MdEventAvailable, MdDescription } from "react-icons/md";
import EventButton from "../EventButton";
import "../styles/EventDetails.css";

const API_URL = "http://localhost:5000/api/v1/events";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

useEffect(() => {
  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(data => {
      console.log("Fetched event:", data);
      setEvent(data);
    })
    .catch(err => console.error("Error fetching event:", err));
}, [id]);

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
              {event.ticketPricing ? `$${event.ticketPricing}` : "No Price"}
            </span>
          </div>
          <div className="event-details-row">
            <MdDescription className="details-icon" />
            <span>{event.description || "No Description"}</span>
          </div>
          <EventButton>
            Book Now
          </EventButton>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;