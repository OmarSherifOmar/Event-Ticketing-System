import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "../components/LoginTextfield.jsx";
import Button from "../components/Button01.jsx";
import "../sitestyle/Auth.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:5000/api/v1";

function LoginForm({ form, onChange, onSubmit, onForgot }) {
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
    </form>
  );
}

function ForgotForm({ email, onChange, onSubmit, onCancel }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h3>Forgot Password</h3>
      <TextField type="email" name="forgotEmail" placeholder="Enter your email" value={email} onChange={onChange} required />
      <Button type="submit">Send OTP</Button>
      <Button type="button" className="cancel-btn" onClick={onCancel}>Cancel</Button>
    </form>
  );
}

function ResetForm({ form, onChange, onSubmit, onCancel }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <h3>Reset Password</h3>
      <TextField type="text" name="otp" placeholder="Enter OTP" value={form.otp} onChange={onChange} required />
      <TextField type="password" name="newPassword" placeholder="New Password" value={form.newPassword} onChange={onChange} required />
      <Button type="submit">Reset Password</Button>
      <Button type="button" className="cancel-btn" onClick={onCancel}>Cancel</Button>
    </form>
  );
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetForm, setResetForm] = useState({ email: "", otp: "", newPassword: "" });
  const navigate = useNavigate();

  // Handlers
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, form, { withCredentials: true });
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Login successful!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/auth/forgetPassword`, { email: forgotEmail });
      toast.success("OTP sent to your email.");
      setShowReset(true);
      setResetForm({ ...resetForm, email: forgotEmail });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP.");
    }
  };

  const handleResetChange = (e) => {
    setResetForm({ ...resetForm, [e.target.name]: e.target.value });
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/auth/resetpassword`, {
        email: resetForm.email,
        token: resetForm.otp, // Change to otp: resetForm.otp if your backend expects 'otp'
        newPassword: resetForm.newPassword,
      });
      toast.success("Password reset successful! You can now log in.");
      setShowForgot(false);
      setShowReset(false);
      setForgotEmail("");
      setResetForm({ email: "", otp: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password.");
    }
  };

  return (
    <div className="main-home">
      <ToastContainer />
      {!showForgot && (
        <LoginForm
          form={form}
          onChange={handleChange}
          onSubmit={handleLogin}
          onForgot={() => setShowForgot(true)}
        />
      )}
      {showForgot && !showReset && (
        <ForgotForm
          email={forgotEmail}
          onChange={e => setForgotEmail(e.target.value)}
          onSubmit={handleForgotSubmit}
          onCancel={() => {
            setShowForgot(false);
            setForgotEmail("");
          }}
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
            setForgotEmail("");
            setResetForm({ email: "", otp: "", newPassword: "" });
          }}
        />
      )}
    </div>
  );
}