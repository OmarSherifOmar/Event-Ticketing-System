import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from '../src/site/Login';
import Register from "./Register";
import Profile from "./Profile";
import { ThemeProvider } from "./ThemeContext";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import EventDetails from "./components/EventView/EventDetails.jsx";
import AdminSettings from "./components/AdminSettings";
import AllUsers from "./components/AllUsers"; // <-- import AllUsers
import EditUserRole from "./components/EditUserRole";
import DeleteUser from "./components/DeleteUser";


function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<><NavBar /><Home /><Footer /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<><NavBar /><Profile /><Footer /></>} />
          <Route path="/events/:id" element={<><NavBar /><EventDetails /><Footer /></>} />
          <Route path="/admin/settings" element={<><NavBar /><AdminSettings /><Footer /></>} />
          <Route path="/admin/users" element={<><NavBar /><AllUsers /><Footer /></>} />
          <Route path="/admin/edit-user-role" element={<><NavBar /><EditUserRole /><Footer /></>} />
<Route path="/admin/delete-user" element={<><NavBar /><DeleteUser /><Footer /></>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;