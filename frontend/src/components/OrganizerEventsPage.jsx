import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/OrganizerEventsPage.css';
import Button from './Button01.jsx';
import EventAnalyticsChart from "./EventAnalytics";

const OrganizerEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get("http://localhost:5000/api/v1/users/events", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [navigate]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="organizer-events-container">
      <h2>Manage Your Events</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.2rem" }}>
        <Button 
          onClick={() => navigate('/create-event')}
          className="create-event-btn"
        >
          Create New Event
        </Button>
        {user?.role === "Organizer" && (
          <Button
            onClick={() => setShowAnalytics((prev) => !prev)}
            className="event-analysis-btn"
          >
            Event Analysis
          </Button>
        )}
      </div>

      {/* Show analytics chart if toggled */}
      {user?.role === "Organizer" && showAnalytics && (
        <EventAnalyticsChart />
      )}

      <div className="events-list">
        {events.length > 0 ? (
          events.map(event => (
            <div key={event._id} className="event-cardOrg">
              <p><strong>Event Name: </strong> {event.title}</p>
              <p><strong>Date: </strong>{new Date(event.date).toLocaleString()}</p>
              <p><strong>Location: </strong>{event.location}</p>
              <Button 
                onClick={() => navigate(`/events/${event._id}`)}
                className="view-event-btn"
              >
                View More
              </Button>
            </div>
          ))
        ) : (
          <p>No events found. Create your first event!</p>
        )}
      </div>
    </div>
  );
};

export default OrganizerEventsPage;