import { useContext, useEffect, useState } from "react";

import { FaBars, FaMoon, FaRobot, FaSun, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/MediPredict_main_logo.png";
import { useTheme } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import AIChatWidget from "./AIChatWidget";

// ===== NEW =====
import "../styles/ai-chat.css";
import "../styles/navbar.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Navbar() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const { theme, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();

    const handleResize = () => {
      if (window.innerWidth > 954 && isMobile) {
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/users/profile`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setUserInfo(null);
    }
  };
  // logout
  const logout = async () => {
    try {
      const response = await fetch(
         `${API_BASE_URL}/api/v1/users/logout`,
        {
          credentials: "include",
          method: "POST",
        }
      );
      if (response.ok) {
        setUserInfo(null);
        toast.success("You have been logged out successfully!", {
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        console.error("Logout failed with status:", response.status);
      }
    } catch (error) {
      console.error("Logout failed with error:", error);
    }
  };

  const isLoggedIn = userInfo?.data?.username;

  const toggleMobileMenu = () => {
    setIsMobile(!isMobile);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobile(false);
    }
  };

  return (
    <>
    <nav className="navbar">
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />

    {/* ==========================
        UPDATED : LEFT SECTION
       ========================== */}

    <div className="navbar-logo">
      <img src={logo} alt="MediPredict" />
    </div>
    

    <div className={`navbar-center ${isMobile ? "mobile active" : ""}`}>

      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "navbar-link active" : "navbar-link"
        }
        onClick={handleLinkClick}
      >
        Home
      </NavLink>

      <NavLink
        to="/predictors"
        className={({ isActive }) =>
          isActive ? "navbar-link active" : "navbar-link"
        }
        onClick={handleLinkClick}
      >
        Predictors
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive ? "navbar-link active" : "navbar-link"
        }
        onClick={handleLinkClick}
      >
        About Us
      </NavLink>

      {/* ==========================
          UPDATED : RIGHT SECTION
         ========================== */}

      <div className={`navbar-right ${isMobile ? "mobile" : ""}`}>

        {/* ===== NEW : AI Chat trigger ===== */}
        <button
          type="button"
          className="ai-chat-trigger-btn"
          onClick={() => setIsChatOpen(true)}
          aria-label="Open AI assistant"
          title="Chat with MediPredict Assistant"
        >
          <FaRobot size={15} />
        </button>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <FaMoon size={16} /> : <FaSun size={16} />}
        </button>

        {isLoggedIn ? (
          <>

            {/* OLD INLINE STYLE REMOVED */}

            <span className="user-name">
              Hello, {userInfo.data.username}
            </span>

            <NavLink
              to="/"
              onClick={logout}
              className="btn btn-logout"
            >
              Logout
            </NavLink>

          </>
        ) : (
          <>

            <NavLink
              to="/login"
              className="btn btn-login"
              onClick={handleLinkClick}
            >
              Login
            </NavLink>

            <NavLink
              to="/signup"
              className="btn btn-signup"
              onClick={handleLinkClick}
            >
              Get Started
            </NavLink>

          </>
        )}

      </div>

    </div>

    <div
      className="hamburger"
      onClick={toggleMobileMenu}
    >
      {isMobile ? <FaTimes size={28} /> : <FaBars size={28} />}
    </div>

  </nav>

    {/* ===== FIXED : moved outside <nav> - the navbar has
        backdrop-filter on it, which creates a containing block
        that traps position:fixed children inside the navbar's
        own small height instead of the full viewport ===== */}
    <AIChatWidget
      isOpen={isChatOpen}
      onClose={() => setIsChatOpen(false)}
    />

    </>
);
}

export default Navbar;
