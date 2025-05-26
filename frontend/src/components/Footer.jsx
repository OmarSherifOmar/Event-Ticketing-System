import { Link } from "react-router-dom";
import "./styles/Footer.css"; // Reusing the same CSS file

function Footer({ theme }) {
  return (
    <footer className={`footer ${theme}`}>
      <div className="footer-content">
        <div className="footer-logo">
         
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/press">Press</Link>
          </div>
          
          <div className="footer-column">
            <h4>Support</h4>
            <Link to="/contact">Contact Us</Link>
            <Link to="/faq">FAQs</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
          
          <div className="footer-column">
            <h4>Follow Us</h4>
            <a href="https://facebook.com">Facebook</a>
            <a href="https://twitter.com">Twitter</a>
            <a href="https://www.instagram.com/omarhossamaboouf?igsh=cHp3MzBnNmRtZ2ph&utm_source=qr">Instagram</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Event Ticketing. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;