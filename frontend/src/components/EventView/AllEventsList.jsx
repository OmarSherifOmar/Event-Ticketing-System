import React, { useEffect, useState } from "react";
import EventCard from "../EventCard";
import NavBar from "../NavBar";
import "../styles/EventList.css";

const API_URL = "http://localhost:5000/api/v1/events";

function AllEventsList() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    fetch(API_URL, { credentials: "include" })
      .then((res) => res.json())
      .then(setEvents);
  }, []);

  useEffect(() => {
    let filtered = events;
    if (search) {
      filtered = filtered.filter(e =>
        e.title?.toLowerCase().includes(search.toLowerCase()) ||
        e.location?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filter) {
      filtered = filtered.filter(e => e.category === filter);
    }
    setFilteredEvents(filtered);
  }, [search, filter, events]);

  const handleView = (id) => (window.location = `/events/${id}`);
  const categories = Array.from(new Set(events.map(e => e.category).filter(Boolean)));

  return (
    <>
      <NavBar />
      <div className="all-events-list-container">
        <div className="all-events-list-controls">
          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="all-events-list-search"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="all-events-list-filter"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="all-events-list-grid">
          {filteredEvents.map(event => (
            <div className="all-events-list-card" key={event._id}>
              <EventCard event={event} onView={handleView} hideMarquee />
            </div>
          ))}
          {filteredEvents.length === 0 && <div className="all-events-list-empty">No events found.</div>}
        </div>
      </div>
    </>
  );
}

export default AllEventsList;
