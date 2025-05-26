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
    profilepicture: "",
    mfaEnabled: false
  });
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
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
        setMfaEnabled(!!parsedUser.mfaEnabled);
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
        setMfaEnabled(!!res.data.mfaEnabled);
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
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
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

  // MFA Toggle Handler
  const handleMfaToggle = async (e) => {
    const checked = e.target.checked;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (checked) {
        await axios.post(`${API_URL}/auth/enable-mfa`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setMessage("MFA enabled! You will be asked for a code next login.");
      } else {
        await axios.post(`${API_URL}/auth/disable-mfa`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setMessage("MFA disabled.");
      }
      setMfaEnabled(checked);
      setUser((u) => ({ ...u, mfaEnabled: checked }));
      localStorage.setItem("user", JSON.stringify({ ...user, mfaEnabled: checked }));
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update MFA setting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-main-layout">
      <div className="profile-combined-card">
        <div className="profile-combined-section profile-combined-user">
          {/* User Info Block */}
          <div className="profile-user-avatar-wrapper">
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
              onClick={() => fileInputRef.current.click()}
              title="Click to change profile picture"
            />
            <input
              id="profile-pic-input"
              type="file"
              accept="image/*"
              className="profile-pic-input"
              ref={fileInputRef}
              onChange={handleProfilePicChange}
              aria-label="Upload profile picture"
            />
          </div>
          <div className="profile-user-info">
            <div className="profile-user-name">{user.name || "User Name"}</div>
            <div className="profile-user-role">{user.role || "Standard User"}</div>
            <button
              className="profile-edit-btn"
              onClick={() => setEditMode(true)}
              disabled={loading}
            >
              Edit Profile
            </button>
            {editMode && (
              <form onSubmit={handleProfileUpdate} className="profile-edit-form">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={loading}
                />
                <div>
                  <button type="submit" disabled={loading}>Save</button>
                  <button type="button" onClick={() => setEditMode(false)} disabled={loading}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {/* MFA Toggle */}
            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={mfaEnabled}
                  onChange={handleMfaToggle}
                  disabled={loading}
                  style={{ width: "18px", height: "18px" }}
                />
                <span>Enable MFA</span>
              </label>
            </div>
          </div>
          {message && <div className="profile-message">{message}</div>}
          {loading && <div className="profile-loading">Loading...</div>}
        </div>
        {/* Divider lines and settings button */}
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
          {user.role === "Standard User" && (
            <>
              <div className="profile-combined-divider"></div>
              <div className="profile-combined-divider"></div>
            </>
          )}
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
        {/* Wallet Section */}
        {user.role === "Standard User" && (
          <div className="profile-combined-section profile-combined-wallet">
            <div className="profile-wallet-balance-label">Wallet Balance</div>
            <div className="profile-wallet-balance-amount">${user.wallet !== undefined ? user.wallet.toFixed(2) : "0.00"}</div>
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
              />
              <button
                type="submit"
                className="profile-wallet-topup-btn"
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