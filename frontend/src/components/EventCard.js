import React from "react";
import EventButton from "./EventButton";
import "./styles/EventCard.css";

function EventCard({event, onView}){
  
  return(
    <div onClick = {() => onView(event)}>
    <img src = {event.image} alt= {event.title}></img>
    <h2>{event.title}</h2>
    <p>{event.location}</p>
    <p>${event.ticketPricing}</p>
    <EventButton onClick={(e) => { e.stopPropagation(); onView(event); }}>
        View Details
    </EventButton>
  </div>
  );
  
}
export default EventCard;