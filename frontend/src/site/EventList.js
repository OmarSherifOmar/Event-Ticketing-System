import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import "../sitestyle/EventList.css";

const API_URL = "http://localhost:5000/api/v1/events";

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleView = (event) => {
    window.location.href = `/events/${event._id}`;
  };

  if (loading) return <div className="eventlist-loading">Loading events...</div>;

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