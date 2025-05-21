import "./styles/NavBar.css"
import { Link } from "react-router-dom";  // Add this import
function NavBar(){
 return(
<div className="main-home">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/" className="navbar-brand">Event Ticketing</Link>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
          </li>
          <li>
            <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>
          </li>
          <li>
            <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>Register</Link>
          </li>
        </ul>
      </nav>
      </div>
 );

}
export default NavBar;  
