import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import "./Profile.css";

const API_URL = "http://localhost:5000/api/v1";

export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    role: "",
    profilepicture: ""
  });
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const settingsRef = useRef();

  useEffect(() => {
    function updateUserFromStorage() {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setEditName(parsedUser.name || "");
      }
    }
    updateUserFromStorage();
    window.addEventListener("storage", updateUserFromStorage);
    return () => window.removeEventListener("storage", updateUserFromStorage);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    }
    if (settingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [settingsOpen]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      // Manually dispatch a storage event so NavBar updates immediately
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch {
      setMessage("Logout failed.");
    }
  };

  // Handle profile picture upload
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("profilepicture", file);

    try {
      const response = await axios.put(
        `${API_URL}/users/profile-picture`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const newProfilePic = response.data.profilepicture || user.profilepicture;
      const updatedUser = { ...user, profilepicture: newProfilePic };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setMessage("Profile picture updated!");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to update profile picture."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle profile info update (e.g., name)
  const handleProfileUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await axios.put(
      `${API_URL}/users/profile`,
      { name: editName },
      { withCredentials: true }
    );
    // Fetch the updated user profile from backend
    const userRes = await axios.get(`${API_URL}/users/profile`, { withCredentials: true });
    setUser(userRes.data);
    localStorage.setItem("user", JSON.stringify(userRes.data));
    window.dispatchEvent(new Event("storage"));
    setMessage("Profile updated successfully!");
    setEditMode(false);
  } catch (err) {
    setMessage(
      err.response?.data?.message || "Failed to update profile."
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="profile-main-layout">
      {/* Top Navigation Bar */}
      <nav className="profile-top-navbar">
        <div className="profile-navbar-left">
          <label style={{ cursor: "pointer" }} htmlFor="profile-pic-input">
            <img
              src={
                user.profilepicture
                  ? user.profilepicture.startsWith("http")
                    ? user.profilepicture
                    : `http://localhost:5000/${user.profilepicture.replace(/\\/g, "/")}`
                  : "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(user.name || "User")
              }
              alt="Profile"
              className="profile-navbar-avatar"
              onClick={() => fileInputRef.current.click()}
              title="Click to change profile picture"
            />
            <input
              id="profile-pic-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleProfilePicChange}
              aria-label="Upload profile picture"
            />
          </label>
          <div>
            <div className="profile-navbar-name">
              {user.name ? user.name : "User Name"}
            </div>
            <div className="profile-navbar-role">
              {user.role ? user.role : "Standard User"}
            </div>
          </div>
        </div>
        <div className="profile-navbar-right" ref={settingsRef}>
          <button
            className="profile-settings-btn"
            onClick={() => setSettingsOpen((open) => !open)}
            aria-label="Settings"
          >
            <FaCog />
          </button>
          {settingsOpen && (
            <div className="profile-settings-dropdown">
              <button
                className="profile-settings-item"
                onClick={() => {
                  setEditMode(true);
                  setSettingsOpen(false);
                }}
              >
                Edit Profile
              </button>
              <button
                className="profile-settings-item logout"
                onClick={() => {
                  setSettingsOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      {/* Welcome Statement */}
      <div className="profile-welcome">
        Welcome, <span className="profile-welcome-name">{user.name ? user.name : "User"}</span>!
      </div>
      <div className="profile-content">
        {message && <div className="profile-message">{message}</div>}
        {loading && <div className="profile-loading">Loading...</div>}
        {editMode && (
          <form onSubmit={handleProfileUpdate} className="profile-edit-form">
            <label>
              Name:
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                disabled={loading}
              />
            </label>
            <button type="submit" disabled={loading}>Save</button>
            <button type="button" onClick={() => setEditMode(false)} disabled={loading}>
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}