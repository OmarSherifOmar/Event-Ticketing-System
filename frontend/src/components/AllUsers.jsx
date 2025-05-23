import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/AdminSettings.css";

const API_URL = "http://localhost:5000/api/v1/users";

function AllUsers() {
  const [users, setUsers] = useState([]);

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