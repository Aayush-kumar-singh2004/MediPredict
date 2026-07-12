import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PredictorsPage from "./pages/PredictorsPage";
import SignupPage from "./pages/SignupPage";
import { ThemeContextProvider } from "./context/ThemeContext";
import { UserContextProvider } from "./context/UserContext";
import LungPage from "./pages/LungPage";

function App() {
  return (
    <ThemeContextProvider>
    <UserContextProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Routes>
            {/* Routes without Navbar */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Routes with Navbar */}
            <Route
              path="/"
              element={
                <div>
                  <Navbar />
                  <HomePage />
                  <Footer />
                </div>
              }
            />
            <Route
              path="/predictors"
              element={
                <div>
                  <Navbar />
                  <PredictorsPage />
                  <Footer />
                </div>
              }
            />
            <Route
              path="/predictors/lung"
              element={
                <div>
                  <Navbar />
                  <LungPage />
                  <Footer />
                </div>
              }
            />

  

            <Route
              path="/about"
              element={
                <div>
                  <Navbar />
                  <AboutPage />
                  <Footer />
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </UserContextProvider>
    </ThemeContextProvider>
  );
}
export default App;
