import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/EventDetails.css";
import { 
  MdLocationOn, 
  MdAttachMoney, 
  MdEventAvailable, 
  MdDescription,
  MdTitle,
  MdImage,
  MdLocalActivity
} from "react-icons/md";
import Button from "../Button01.jsx";
import "../styles/EditEvent.css";

const API_URL = "http://localhost:5000/api/v1/events";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    ticketPricing: 0,
    totalTickets: 0,
    image: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          credentials: "include"
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch event");
        
        // Format date for datetime-local input
        const eventDate = new Date(data.date);
        const formattedDate = eventDate.toISOString().slice(0, 16);
        
        setEvent({
          ...data,
          date: formattedDate
        });
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prev => ({
      ...prev,
      [name]: name === "ticketPricing" || name === "totalTickets" 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(event),
        credentials: "include"
      });

      // First check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Invalid response from server");
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update event");
      }
      
      setSuccess(true);
      setTimeout(() => navigate(`/`), 1500);
    } catch (err) {
      // Handle HTML error responses
      if (err.message.startsWith("<!DOCTYPE html>")) {
        setError("Server returned an error page. Check your API endpoint.");
      } else {
        setError(err.message);
      }
      console.error("Submission error:", err);
    }
  };

  if (isLoading) return <div className="edit-event-loading">Loading event details...</div>;
  if (error) return <div className="edit-event-error">Error: {error}</div>;

  return (
    <div className="event-details-page">
      <div className="event-details-card">
        <div className="event-details-layout">
          <div className="event-details-image-wrapper">
            <img
              className="event-details-image"
              src={event.image || "https://via.placeholder.com/340x340?text=No+Image"}
              alt={event.title}
            />
          </div>
          <div className="event-details-info">
            <h1>{event.title || "Event Title"}</h1>
            <div className="event-details-row"><MdLocationOn color="#6366f1" /> {event.location}</div>
            <div className="event-details-row"><MdEventAvailable color="#6366f1" /> {event.date ? new Date(event.date).toLocaleString() : ""}</div>
            <div className="event-details-row"><MdAttachMoney color="#6366f1" /> <span className="event-details-price">${event.ticketPricing}</span></div>
            <div className="event-details-row"><MdLocalActivity color="#6366f1" /> {event.totalTickets} ticket(s) left</div>
            <div className="event-details-row"><MdDescription color="#6366f1" /> {event.description}</div>
            <form onSubmit={handleSubmit} className="edit-event-form">
              <div className="form-group">
                <label><MdTitle className="form-icon" /> Event Title</label>
                <input type="text" name="title" value={event.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label><MdDescription className="form-icon" /> Description</label>
                <textarea name="description" value={event.description} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label><MdLocationOn className="form-icon" /> Location</label>
                <input type="text" name="location" value={event.location} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label><MdEventAvailable className="form-icon" /> Date and Time</label>
                <input type="datetime-local" name="date" value={event.date} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label><MdAttachMoney className="form-icon" /> Ticket Price ($)</label>
                  <input type="number" name="ticketPricing" min="0" step="0.01" value={event.ticketPricing} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label><MdLocalActivity className="form-icon" /> Total Tickets</label>
                  <input type="number" name="totalTickets" min="1" value={event.totalTickets} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label><MdImage className="form-icon" /> Image URL</label>
                <input type="text" name="image" value={event.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                {event.image && (
                  <div className="image-preview">
                    <img src={event.image} alt="Event preview" />
                  </div>
                )}
              </div>
              <div className="form-actions">
                <Button type="submit" className="save-btn">
                  Save Changes
                </Button>
                <Button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => navigate(`/`)}
                >
                  Cancel
                </Button>
              </div>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">Event updated successfully!</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditEvent;