import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import LoginVector from "../assets/LoginVector.png";
import { UserContext } from "../context/UserContext";
import "../styles/auth.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LoginPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill out all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Email or Password is incorrect.");
        } else {
          throw new Error();
        }
        return;
      }

      const userInfo = await response.json();

      setUserInfo(userInfo);

      toast.success("Login Successful!");

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  }

  // function loginAsGuest() {
  //   setEmail("guestuser10@gmail.com");
  //   setPassword("12345678");
  // }
  async function loginAsGuest() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/users/guest-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const userInfo = await response.json();
      setUserInfo(userInfo);

      toast.success("Logged in as guest!");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Could not log in as guest. Please try again.");
    }
  }

  return (
  <div className="login-page">

    <ToastContainer
      position="top-right"
      autoClose={5000}
      theme="dark"
    />

    {/* Background Glow */}

    <div className="login-bg login-bg-one"></div>
    <div className="login-bg login-bg-two"></div>

    <div className="login-wrapper">

      {/* LEFT */}

      <div className="login-left">

        <span className="login-badge">
          🔒 Secure Authentication
        </span>

        <h1 className="login-title">
          Welcome <span>Back</span>
        </h1>

        <div className="login-line"></div>

        <p className="login-subtitle">
          Login to access your AI-powered healthcare dashboard,
          disease prediction models and personalized health
          insights.
        </p>

        <form
          className="login-form"
          onSubmit={login}
        >

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="login-button"
          >
            LOGIN
          </button>

        </form>

        <button
          className="guest-login-button"
          onClick={loginAsGuest}
        >
          Continue as Guest
        </button>

        <div className="login-footer">

          <p>
            Don't have an account?
          </p>

          <Link to="/signup">
            Create Account
          </Link>

        </div>

      </div>

      {/* RIGHT */}

      <div className="login-right">

        <div className="login-image-glow"></div>

        <img
          src={LoginVector}
          alt="Login"
        />

      </div>

    </div>

  </div>
);
}
export default LoginPage;

