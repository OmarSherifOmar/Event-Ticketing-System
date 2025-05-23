import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Added useParams here
import './styles/ViewEventPage.css';
import Button from './Button01.jsx';
const ViewEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/v1/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEvent(res.data);
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
    }, [eventId,navigate]);
    // Loading state
  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <Button onClick={() => navigate('/organizer-events')}>
          Back to Events
        </Button>
      </div>
    );
  }

  // No event found state
  if (!event) {
    return (
      <div className="not-found">
        <p>Event not found</p>
        <Button onClick={() => navigate('/organizer-events')}>
          Back to Events
        </Button>
      </div>
    );
  }

    <div className="view-event-container">
      <h2>{event.title}</h2>
      
      <div className="event-details">
        <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Description:</strong> {event.description}</p>
        {/* Add more event details as needed */}
      </div>

      <div className="action-buttons">
        <Button onClick={() => navigate("/OrganizerEventsPage")} className="back-btn">
          Back to Events
        </Button>
        {/* Add edit button if needed */}
      </div>
    </div>
  
};

export default ViewEventPage;
