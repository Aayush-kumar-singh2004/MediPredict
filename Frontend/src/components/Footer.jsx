import { Link } from "react-router-dom";
import logo from "../assets/MediPredict_main_logo.png";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <img src={logo} alt="MediPredict" className="footer-logo" />
          <p className="footer-tagline">
            AI-powered disease prediction platform for faster, smarter
            health decisions.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/predictors">Predictors</Link>
          <Link to="/about">About Us</Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} MediPredict. All rights reserved.
        </p>
        <p className="footer-disclaimer">
          MediPredict is a decision-support tool, not a substitute for
          professional medical diagnosis.
        </p>
      </div>
    </footer>
  );
}

export default Footer;