import React, { useEffect, useState } from "react";
import EventCard from "../EventCard";
import "../styles/EventList.css";

const API_URL = "http://localhost:5000/api/v1/events";
function EventList(){
    const [events,setEvents] = useState([]);
    useEffect(()=>{
        fetch(API_URL, { credentials: "include"})
        .then(res=>res.json())
        .then(setEvents);},[]);
    const handleView = (id) => window.location = `/events/${id}`;
    return (
    <div className="eventlist-container">
      <h2 className="eventlist-title">Upcoming Events</h2>
      <div className="eventlist-grid">
        {events.map((event) => (
          <EventCard key={event._id} event={event} onView={handleView} />
        ))}
      </div>
    </div>
  );
}

export default EventList;