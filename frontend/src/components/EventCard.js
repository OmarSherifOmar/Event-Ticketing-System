import React from "react";
import EventButton from "./EventButton";
import "./styles/EventCard.css";
import { MdAttachMoney, MdEventAvailable, MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";
function EventCard({event}){
  const navigate = useNavigate();
  return(
    <div  className="event-card" onClick = {() => navigate(`/events/${event._id}`)}>
      <div className="event-image-container">
        <img className="event-image" src = "https://cdn.pixabay.com/photo/2021/10/30/17/54/desert-6755127_1280.jpg" alt= {event.title}></img>
      </div>
    <div className="event-info"> 
      <h2 className="event-title">{event.title}</h2>
      <div className="event-details">
        <div className="detail-item">
            <MdLocationOn className="details-icon"/>
            <p>{event.location}</p>
        </div>
        <div className="detail-item">
            <MdAttachMoney className="details-icon"/>
            <p className="event-price">{event.ticketPricing}</p>
        </div>
      </div>
      <div className="detail-item">
            <MdEventAvailable className="details-icon"/>
            <p>{event.date}</p>
        </div>
      <EventButton onClick={(e) => { e.stopPropagation(); navigate(`/events/${event._id}`); }}>
          View Details
      </EventButton>
    </div>
  </div>
  );
  
}
export default EventCard;