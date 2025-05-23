import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ManageOrganizerEvents.css"; // Using the same CSS file
import Button from "./Button01";

const ManageOrganizerEvents = ({ user }) => {
  const navigate = useNavigate();

  const handleManageEvents = () => {
    navigate("/organizer-events");
  };

  // Early return if not organizer (note: case-sensitive comparison)
  if (user.role !== "Organizer") {  // Changed from != to !== for strict comparison
    return null;
  }

  return (
    <Button 
      className="create-event-btn"  // Using the same class name for consistent styling
      onClick={handleManageEvents}
    >
      Manage My Events
    </Button>
  );
};

export default ManageOrganizerEvents;