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
import UserBookingsPage from "./UserBookingsPage";
import OrganizerEventsPage from "./components/OrganizerEventsPage"; // Add this import
import CreateEventPage from "./components/CreateEventPage.jsx";
import EditEvent from "./components/EventView/EditEvent.jsx";
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
          <Route path="/profile" element={<><NavBar />,<Profile />,<Footer/></>} />
          <Route path="/bookings" element={<><NavBar />,<UserBookingsPage />,<Footer/></>} />
          <Route path="/events/:id" element={<><NavBar />,<EventDetails />,<Footer/></>} />
          <Route path="/organizer-events" element={<><NavBar /><OrganizerEventsPage /><Footer/></>} />
          <Route path="/create-event" element={<><NavBar /><CreateEventPage /><Footer/></>} />
          <Route path="/edit-event/:id" element={<><NavBar /><EditEvent /><Footer/></>} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;