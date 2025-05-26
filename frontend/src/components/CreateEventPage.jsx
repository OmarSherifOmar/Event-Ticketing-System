import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateEventPage.css';
import Button from './Button01.jsx';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    category: '',
    image: '',
    ticketPricing: '',
    totalTickets: ''
  });
  const [error, setError] = useState('');

useEffect(() => {
  const checkAuthorization = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Immediate check for basic authorization
      if (!token || !user || ![ "Organizer"].includes(user.role)) {
        navigate("/Unauthorized");
        return;
      } 
    } catch (err) {
      navigate("/Unauthorized");
    }
};
checkAuthorization();
})


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage

    const eventData = {
      ...formData,
      ticketPricing: Number(formData.ticketPricing),
      totalTickets: Number(formData.totalTickets),
      remainingTickets: Number(formData.totalTickets),
      organizer: user._id // ✅ This is how you get the ID
    };

    const response = await axios.post(
      'http://localhost:5000/api/v1/events',
      eventData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    navigate('/organizer-events');
  } catch (err) {
    setError(err.response?.data?.message || 'Event creation failed');
    console.error('Error:', err);

    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }
};


 
  return (
    <div className="create-event-container">
      <h2>Create New Event</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Event Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category*</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
              <option value="art">Art</option>
              <option value="food">Food & Drink</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date and Time*</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location*</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Image URL*</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="form-group">
            <label>Ticket Price ($)*</label>
            <input
              type="number"
              name="ticketPricing"
              value={formData.ticketPricing}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Total Tickets*</label>
            <input
              type="number"
              name="totalTickets"
              value={formData.totalTickets}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>

        <div className="form-actions">
          <Button type="submit" className="submit-btn">
            Create Event
          </Button>
          <Button 
            type="button" 
            onClick={() => navigate('/organizer-events')}
            className="cancel-btn"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;