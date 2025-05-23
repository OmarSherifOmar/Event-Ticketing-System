import React, { useEffect, useState, useRef } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import { FaCog } from "react-icons/fa";
  import "./Profile.css";
  import "./BookingSection.css";

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
  async function fetchUserProfile() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      // Optionally handle error
    }
    }
     fetchUserProfile();
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
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true }); // <-- add /auth
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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
        const response = await axios.put(
          `${API_URL}/users/profile`,
          { name: editName },
          { withCredentials: true }
        );
        const updatedUser = { ...user, name: response.data.name };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
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

    const handleWalletTopUp = async (e) => {
      e.preventDefault();
      const amount = parseFloat(e.target.elements.topupAmount.value);
      if (isNaN(amount) || amount <= 0) {
        setMessage("Enter a valid amount");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${API_URL}/users/wallet/topup`,
          { amount },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser((u) => ({ ...u, wallet: res.data.wallet }));
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, wallet: res.data.wallet })
        );
        setMessage("Wallet topped up!");
        e.target.reset();
      } catch (err) {
        setMessage(
          err.response?.data?.message || "Failed to top up wallet."
        );
      }
    };

    return (
      <div className="profile-main-layout">
        <div className="profile-content" style={{ display: "flex", gap: "2.2rem", minHeight: "400px", alignItems: "flex-start", paddingTop: "3rem", justifyContent: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "flex-start", minWidth: 0 }}>
            <div className="profile-user-card" style={{ maxWidth: "320px", minWidth: "200px", flex: "0 0 260px", padding: "2rem 1.2rem", boxSizing: "border-box", marginRight: "1.2rem" }}>
              <div className="profile-user-avatar-wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1.2rem" }}>
                <img
                  src={
                    user.profilepicture
                      ? user.profilepicture.startsWith("http")
                        ? user.profilepicture
                        : `http://localhost:5000/${user.profilepicture.replace(/\\/g, "/")}`
                      : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name || "User")
                  }
                  alt="Profile"
                  className="profile-user-avatar"
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "50%", boxShadow: "0 2px 8px #e0e0e0", cursor: "pointer" }}
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
              </div>
              <div className="profile-user-info" style={{ textAlign: "center" }}>
                <div className="profile-user-name" style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: "0.3rem" }}>{user.name || "User Name"}</div>
                <div className="profile-user-role" style={{ fontSize: "0.98rem", color: "#888", marginBottom: "0.7rem" }}>{user.role || "Standard User"}</div>
                <button
                  className="profile-edit-btn"
                  style={{ fontSize: "0.98rem", padding: "6px 16px", borderRadius: "5px" }}
                  onClick={() => setEditMode(true)}
                  disabled={loading}
                >
                  Edit Profile
                </button>
                {editMode && (
                  <form onSubmit={handleProfileUpdate} className="profile-edit-form" style={{ marginTop: "1rem" }}>
                    <label style={{ fontSize: "0.93rem" }}>
                      Name:
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        disabled={loading}
                        style={{ marginLeft: "0.5rem", fontSize: "0.98rem", padding: "4px 8px", borderRadius: "4px", border: "1px solid #ccc" }}
                      />
                    </label>
                    <div style={{ marginTop: "0.7rem" }}>
                      <button type="submit" disabled={loading} style={{ marginRight: "0.5rem", fontSize: "0.93rem" }}>Save</button>
                      <button type="button" onClick={() => setEditMode(false)} disabled={loading} style={{ fontSize: "0.93rem" }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
              {message && <div className="profile-message">{message}</div>}
              {loading && <div className="profile-loading">Loading...</div>}
            </div>
            <div className="profile-navbar-right" ref={settingsRef} style={{ marginLeft: "0.7rem", alignSelf: "flex-start" }}>
              <button
                className="profile-settings-btn"
                onClick={() => setSettingsOpen((open) => !open)}
                aria-label="Settings"
                style={{ fontSize: "1.5rem", padding: "8px 12px", borderRadius: "50%", background: "#f5f5f5", border: "none", boxShadow: "0 1px 4px #e0e0e0", marginTop: "0.5rem" }}
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
                  {user.role === "Standard User" && (
                    <button
                      className="profile-settings-item"
                      onClick={() => {
                        setSettingsOpen(false);
                        navigate("/bookings");
                      }}
                    >
                      My Bookings
                    </button>
                  )}
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
          </div>

          {user.role === "Standard User" && (
            <div className="profile-wallet-card profile-wallet-card-right" style={{ minWidth: "340px", maxWidth: "480px", flex: "1.3 1 420px", padding: "2.2rem 2.2rem", boxSizing: "border-box", marginLeft: "0.5rem" }}>
              <div className="profile-wallet-balance-label" style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.7rem" }}>Wallet Balance</div>
              <div className="profile-wallet-balance-amount" style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "1.5rem" }}>${user.wallet !== undefined ? user.wallet.toFixed(2) : "0.00"}</div>
              <form
                onSubmit={handleWalletTopUp}
                style={{ marginTop: "1.2rem" }}
              >
                <input
                  type="number"
                  name="topupAmount"
                  min="1"
                  step="0.01"
                  placeholder="Amount"
                  className="profile-wallet-topup-input"
                  style={{ width: "130px", marginRight: "1rem", padding: "12px 16px", borderRadius: "7px", border: "1px solid #bdbdbd", fontSize: "1.2rem" }}
                />
                <button
                  type="submit"
                  className="profile-wallet-topup-btn"
                  style={{ padding: "13px 36px", borderRadius: "7px", background: "linear-gradient(90deg, #a777e3, #6e8efb)", color: "#fff", border: "none", fontWeight: 700, fontSize: "1.1rem", cursor: "pointer" }}
                >
                  Top Up
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }