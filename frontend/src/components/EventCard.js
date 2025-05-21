import React from "react";
import EventButton from "./EventButton";
import "./styles/EventCard.css";

function EventCard({ event, onView }) {
  return (
    <div className="event-card" onClick={() => onView(event)}>
      <img src={event.image} alt={event.title} className="event-image" />
      <div className="event-info">
        <h3>{event.title}</h3>
        <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
        <p className="event-location">{event.location}</p>
        <p className="event-price">${event.ticketPricing}</p>
      </div>
      <EventButton onClick={(e) => { e.stopPropagation(); onView(event); }}>
        View Details
      </EventButton>
    </div>
  );
}

export default EventCard;