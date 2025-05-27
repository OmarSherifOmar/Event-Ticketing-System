import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/AdminSettings.css";
import { useNavigate } from "react-router-dom";
const API_URL = "http://localhost:5000/api/v1/users";

function AllUsers() {
  const [users, setUsers] = useState([]);
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
    axios.get(API_URL, { withCredentials: true })
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="admin-users-container">
      <h2>All Users</h2>
      <table className="admin-users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllUsers;