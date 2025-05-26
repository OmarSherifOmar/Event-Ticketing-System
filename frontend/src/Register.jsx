import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "./components/RegisterationForm";
import "./sitestyle/Auth.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:5000/api/v1";

// Loader component
function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Standard User"
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // <-- Add this line
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post(`${API_URL}/auth/register`, form);
      toast.success("Registeration successful!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-home">
      <ToastContainer />
      {loading && <Loader />}
      <RegistrationForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        message={message}
      />
    </div>
  );
}