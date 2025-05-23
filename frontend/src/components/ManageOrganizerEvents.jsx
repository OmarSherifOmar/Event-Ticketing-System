import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ManageOrganizerEvents.css"; // Optional for styling

const ManageOrganizerEvents = ({ user }) => {
  const navigate = useNavigate();

  const ManageOrganizerEvents = () => {
    navigate("/organizer-events");
  };


  return (
    <button 
      className="manage-Events-btn"
      onClick={ManageOrganizerEvents}
    >
      Manage My Events
    </button>
  );
};

export default ManageOrganizerEvents;