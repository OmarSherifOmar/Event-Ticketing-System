import "./styles/NavBar.css"
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function NavBar() {
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    function handleStorage() {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    }
    window.addEventListener("storage", handleStorage);
    handleStorage();
    return () => window.removeEventListener("storage", handleStorage);
  }, [location]);

  const isLoggedIn = !!user;
  const isAdmin = user && user.role && user.role === "System Admin";

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
            <>
              <li>
                <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>My Profile</Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin/settings" className={location.pathname === "/admin/settings" ? "active" : ""}>
                    Manage Settings
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
export default NavBar;