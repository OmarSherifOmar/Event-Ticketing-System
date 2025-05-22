import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from '../src/site/Login';
import Register from "./Register";
import Profile from "./Profile";
import { ThemeProvider } from "./ThemeContext"; // <-- import ThemeProvider
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import EventDetails from "./components/EventView/EventDetails.jsx";
function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<><NavBar />,<Home />,<Footer/></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<><NavBar />,<Profile />,<Footer/></>} />
          <Route path="/events/:id" element={<><NavBar />,<EventDetails />,<Footer/></>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;