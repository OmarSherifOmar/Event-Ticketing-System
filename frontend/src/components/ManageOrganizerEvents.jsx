
import { useNavigate } from "react-router-dom";
import "./styles/ManageOrganizerEvents.css"; // Using the same CSS file

const ManageOrganizerEvents = ({ user }) => {
  const navigate = useNavigate();


  // Early return if not organizer (note: case-sensitive comparison)
  if (!user||user.role !== "Organizer") {  // Changed from != to !== for strict comparison
    return null;
  }

  
};

export default ManageOrganizerEvents;