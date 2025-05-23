import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/users";

function EditUserRole() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newRole, setNewRole] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch all users for selection
    axios.get(API_URL, { withCredentials: true })
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !newRole) {
      setMessage("Please select a user and a role.");
      return;
    }
    try {
      await axios.put(
        `${API_URL}/${selectedUserId}`,
        { role: newRole },
        { withCredentials: true }
      );
      setMessage("User role updated successfully!");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to update user role."
      );
    }
  };

  return (
    <div className="admin-settings-container">
      <h2>Edit User Role</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Select User:
            <select
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
            >
              <option value="">-- Select User --</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>
            New Role:
            <select
              value={newRole}
              onChange={e => setNewRole(e.target.value)}
            >
              <option value="">-- Select Role --</option>
              <option value="Standard User">Standard User</option>
              <option value="Organizer">Organizer</option>
              <option value="System Admin">System Admin</option>
            </select>
          </label>
        </div>
        <button className="admin-btn" type="submit" style={{ marginTop: "1.5rem" }}>
          Update Role
        </button>
      </form>
      {message && <div style={{ marginTop: "1rem", color: "#a777e3" }}>{message}</div>}
    </div>
  );
}

export default EditUserRole;