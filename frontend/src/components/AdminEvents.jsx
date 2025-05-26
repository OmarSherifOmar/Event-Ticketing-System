import React, { useEffect, useState } from "react";
import "./styles/AdminEvent.css";

const API_URL = "http://localhost:5000/api/v1/events";

function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/all`, { 
          credentials: "include" 
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        setEvents(data.map(event => ({
          ...event,
          status: event.status?.toLowerCase() || 'pending'
        })));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      // Optimistic UI update
      setEvents(events.map(event => 
        event._id === eventId ? { ...event, status: newStatus } : event
      ));

      const response = await fetch(`${API_URL}/${eventId}`, {
        method: "PUT", // Changed from PATCH to PUT
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update status: ${response.status}`);
      }

      const updatedEvent = await response.json();
      
      // Final update with server response
      setEvents(events.map(event =>
        event._id === updatedEvent._id 
          ? updatedEvent
          : event
      ));
    } catch (error) {
      console.error("Update error:", error);
      setError(error.message);
      // Revert on error
      setEvents(events.map(event => 
        event._id === eventId 
          ? { ...event, status: "pending" } 
          : event
      ));
    }
  };

  const filteredEvents = events.filter(event => 
    filter === "all" || event.status === filter
  );

  return (
    <div className="admin-events-container">
      <h2>Manage Events</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="filter-buttons">
        {["all", "approved", "pending", "declined"].map(option => (
          <button
            key={option}
            className={filter === option ? "active" : ""}
            onClick={() => setFilter(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <p>No {filter === "all" ? "" : filter} events found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(event => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td>
                  <span className={`status ${event.status}`}>
                    {event.status}
                  </span>
                </td>
                <td>
                  {event.status === "pending" && (
                    <div className="action-buttons">
                      <button
                        className="approve-btn"
                        onClick={() => handleStatusChange(event._id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="decline-btn"
                        onClick={() => handleStatusChange(event._id, "declined")}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminEventsPage;