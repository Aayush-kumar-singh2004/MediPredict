import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ===== Existing App Styles =====
import "./App.css";
// ===== Global Design System =====
import "./styles/ai-chat.css";
import "./styles/animations.css";
import "./styles/auth.css";
import "./styles/Card.css";
import "./styles/components.css";
import "./styles/footer.css";
import "./styles/global.css";
import "./styles/hero.css";
import "./styles/navbar.css";
import "./styles/pages.css";
import "./styles/predictors.css";
import "./styles/responsive.css";
import "./styles/variables.css";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {console.log(import.meta.env)}
    <App />
  </React.StrictMode>
);