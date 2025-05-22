import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "./components/RegisterationForm";
import "./sitestyle/Auth.css";

const API_URL = "http://localhost:5000/api/v1";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Standard User"
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post(`${API_URL}/auth/register`, form);
      setMessage("Registration successful!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="main-home">
      <RegistrationForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        message={message}
      />
    </div>
  );
}