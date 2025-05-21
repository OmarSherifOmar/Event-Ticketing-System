import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "../components/LoginTextfield.jsx";
import Button from "../components/Button01.jsx";
import "../sitestyle/Auth.css";

const API_URL = "http://localhost:5000/api/v1";

function LoginForm({ form, onChange, onSubmit, onForgot, message }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h2>Login</h2>
      <TextField type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
      <TextField type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required />
      <Button type="submit">Login</Button>
      <div style={{ marginTop: "10px" }}>
        <Button type="button" className="forgot-link-btn" onClick={onForgot}>
          Forgot Password?
        </Button>
      </div>
      {message && <div className="message">{message}</div>}
    </form>
  );
}

function ForgotForm({ email, onChange, onSubmit, onCancel, message }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h3>Forgot Password</h3>
      <TextField type="email" name="forgotEmail" placeholder="Enter your email" value={email} onChange={onChange} required />
      <Button type="submit">Send OTP</Button>
      <Button type="button" className="cancel-btn" onClick={onCancel}>Cancel</Button>
      {message && <div className="message">{message}</div>}
    </form>
  );
}

// --- ResetForm component defined here ---
function ResetForm({ form, onChange, onSubmit, onCancel, message }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h3>Reset Password</h3>
      <TextField type="text" name="otp" placeholder="Enter OTP" value={form.otp} onChange={onChange} required />
      <TextField type="password" name="newPassword" placeholder="New Password" value={form.newPassword} onChange={onChange} required />
      <Button type="submit">Reset Password</Button>
      <Button type="button" className="cancel-btn" onClick={onCancel}>Cancel</Button>
      {message && <div className="message">{message}</div>}
    </form>
  );
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetForm, setResetForm] = useState({ email: "", otp: "", newPassword: "" });
  const [resetMsg, setResetMsg] = useState("");
  const navigate = useNavigate();

  // Handlers
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(`${API_URL}/auth/login`, form, { withCredentials: true });
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setMessage("Login successful!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed.");
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotMsg("");
    try {
      await axios.put(`${API_URL}/auth/forgetPassword`, { email: forgotEmail });
      setForgotMsg("OTP sent to your email.");
      setShowReset(true);
      setResetForm({ ...resetForm, email: forgotEmail });
    } catch (err) {
      setForgotMsg(err.response?.data?.message || "Error sending OTP.");
    }
  };

  // Handler for ResetForm input changes
  const handleResetChange = (e) => {
    setResetForm({ ...resetForm, [e.target.name]: e.target.value });
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetMsg("");
    try {
      await axios.put(`${API_URL}/auth/resetpassword`, {
        email: resetForm.email,
        token: resetForm.otp, // Change to otp: resetForm.otp if your backend expects 'otp'
        newPassword: resetForm.newPassword,
      });
      setResetMsg("Password reset successful! You can now log in.");
      setShowForgot(false);
      setShowReset(false);
      setForgotEmail("");
      setResetForm({ email: "", otp: "", newPassword: "" });
    } catch (err) {
      setResetMsg(err.response?.data?.message || "Error resetting password.");
    }
  };

  return (
    <div className="main-home">
      {!showForgot && (
        <LoginForm
          form={form}
          onChange={handleChange}
          onSubmit={handleLogin}
          onForgot={() => setShowForgot(true)}
          message={message}
        />
      )}
      {showForgot && !showReset && (
        <ForgotForm
          email={forgotEmail}
          onChange={e => setForgotEmail(e.target.value)}
          onSubmit={handleForgotSubmit}
          onCancel={() => {
            setShowForgot(false);
            setForgotMsg("");
            setForgotEmail("");
          }}
          message={forgotMsg}
        />
      )}
      {showForgot && showReset && (
        <ResetForm
          form={resetForm}
          onChange={handleResetChange}
          onSubmit={handleResetSubmit}
          onCancel={() => {
            setShowForgot(false);
            setShowReset(false);
            setForgotMsg("");
            setResetMsg("");
            setForgotEmail("");
            setResetForm({ email: "", otp: "", newPassword: "" });
          }}
          message={resetMsg}
        />
      )}
    </div>
  );
}