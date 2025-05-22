import "./styles/NavBar.css"
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function NavBar() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));

  useEffect(() => {
    function handleStorage() {
      setIsLoggedIn(!!localStorage.getItem("user"));
    }
    window.addEventListener("storage", handleStorage);
    // Update state on mount in case login/logout happens in this tab
    handleStorage();
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="navmain">
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/" className="navbar-brand">Event Ticketing</Link>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
          </li>
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>
              </li>
              <li>
                <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>Register</Link>
              </li>
            </>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>My Profile</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
export default NavBar;
