import React from "react";
import Button from "../Button01.jsx"; // your button component

const ManageEventButtons = ({ user, eventId, onDelete }) => {
  if (user?.role == "Standard User") {
    return null;
  }

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      onDelete(eventId);
    }
  };

  return (
    <div className="manage-event-buttons">
      <Button className="edit-event-btn" onClick={() => {/* your edit logic or navigation here */}}>
        Edit
      </Button>
      <Button className="delete-event-btn" onClick={handleDeleteClick} style={{ marginLeft: "10px", backgroundColor: "red" }}>
        Delete
      </Button>
    </div>
  );
};

export default ManageEventButtons;
