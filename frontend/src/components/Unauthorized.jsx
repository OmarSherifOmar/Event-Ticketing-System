import { useNavigate } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";
import "../components/styles/Unauthorized.css";
import Button from "./Button01";
function Unauthorized() {
  const navigate = useNavigate();
  
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        <MdErrorOutline className="unauthorized-icon" />
        <h1 className="unauthorized-title">401 - Unauthorized Access</h1>
        <p className="unauthorized-message">
          You don't have permission to view this page. Please contact the administrator if you believe this is an error.
        </p>
        <div className="unauthorized-actions">
          <Button 
            className="unauthorized-button tertiary"
            onClick={() => navigate("/login")}
          >
            Login as Different User
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;