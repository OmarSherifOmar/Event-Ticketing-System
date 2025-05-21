import React from "react";
import "./styles/EventButton.css";

function EventButton({ children, onClick }) {
  return (
    <button className="event-btn" onClick={onClick}>
      {children}
    </button>
  );
}

export default EventButton;