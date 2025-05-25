import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/AdminSettings.css";

function AdminSettings() {
  const navigate = useNavigate();

  const handleViewAllUsers = () => {
    navigate("/admin/users");
  };

  const handleEditUserRole = () => {
    navigate("/admin/edit-user-role");
  };

  const handleDeleteUser = () => {
    navigate("/admin/delete-user");
  };
  const handleEditEventStatus = () => {
    navigate("/admin/events");
  };

  return (
    <div className="admin-settings-container">
      <h2>Admin Settings</h2>
      <button className="admin-btn" onClick={handleViewAllUsers}>
        View All Users
      </button>
      <button className="admin-btn" onClick={handleEditUserRole} style={{ marginLeft: "1rem" }}>
        Edit User Role
      </button>
      <button className="admin-btn" onClick={handleDeleteUser} style={{ marginLeft: "1rem", background: "linear-gradient(90deg, #e36477, #e36e6e)" }}>
        Delete User
      </button>
      <button className="admin-btn" onClick={handleEditEventStatus} style={{ marginLeft: "1rem", background: "linear-gradient(90deg, #6e8efb, #a777e3)" }}>
        Edit Event Status
      </button>
      {/* Add more admin controls here */}
    </div>
  );
}

export default AdminSettings;