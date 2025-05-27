import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = "http://localhost:5000/api/v1/users";

function DeleteUser() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [message, setMessage] = useState("");
     const navigate = useNavigate(); // You need to call this hook inside a component

useEffect(() => {
  const checkAuthorization = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Immediate check for basic authorization
      if (!token || !user || ![ "System Admin"].includes(user.role)) {
        navigate("/Unauthorized");
        return;
      } 
    } catch (err) {
      navigate("/Unauthorized");
    }
};
checkAuthorization();
})
  useEffect(() => {
    // Fetch all users for selection
    axios
      .get(API_URL, { withCredentials: true })
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      setMessage("Please select a user to delete.");
      return;
    }
    try {
      await axios.delete(`${API_URL}/${selectedUserId}`, { withCredentials: true });
      setMessage("User deleted successfully!");
      setUsers(users.filter((u) => u._id !== selectedUserId));
      setSelectedUserId("");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to delete user."
      );
    }
  };

  return (
    <div className="admin-settings-container">
      <h2>Delete User</h2>
      <form onSubmit={handleDelete}>
        <label>
          Select User:
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">-- Select User --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </label>
        <button className="admin-btn" type="submit" style={{ marginLeft: "1rem", background: "linear-gradient(90deg, #e36477, #e36e6e)" }}>
          Delete User
        </button>
      </form>
      {message && <div style={{ marginTop: "1rem", color: "#e36e6e" }}>{message}</div>}
    </div>
  );
}

export default DeleteUser;