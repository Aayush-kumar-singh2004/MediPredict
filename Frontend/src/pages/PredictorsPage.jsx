import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Card from "../components/Card";

import { UserContext } from "../context/UserContext";

import "../App.css";
function PredictorsPage() {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    if (userInfo) {
      navigate(path);
    } else {
      toast.info("Please login to access this predictor.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <section className="predictor-container">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ================= Header ================= */}

      <div className="predictor-header">

        <span className="predictor-badge">
          🩺 AI Disease Predictors
        </span>

        <h1>
          Choose Your <span>Health Assessment</span>
        </h1>

        <p>
          Explore our AI-powered disease prediction tools designed to
          provide quick, reliable, and intelligent health assessments.
          Select a predictor below to begin your analysis and receive
          AI-assisted medical insights within seconds.
        </p>

      </div>

      {/* ================= Predictor Cards ================= */}

      <div className="card-container">

        {/* Heart Disease */}

        <div
          className="card-item card-item-disabled"
          onClick={() =>
            toast.info("Heart Disease predictor is coming soon!")
          }
        >
          <Card
            video="/heart-video.mp4"
            title="Heart Disease"
            description="Detect cardiovascular risks using advanced machine learning models trained to identify early warning signs for proactive healthcare."
            comingSoon={true}
          />
        </div>

        {/* Lung Cancer */}

        <div
          className="card-item"
          onClick={() => handleLinkClick("/predictors/lung")}
        >
          <Card
            video="/lung-video.mp4"
            title="Lung Cancer"
            description="Analyze lung cancer probability using intelligent AI algorithms designed for early detection and faster medical decision support."
          />
        </div>

        {/* Diabetes */}

        <div
          className="card-item card-item-disabled"
          onClick={() =>
            toast.info("Diabetes predictor is coming soon!")
          }
        >
          <Card
            video="/diabetes-video.mp4"
            title="Diabetes"
            description="Assess diabetes risk using clinical information such as glucose level, BMI, insulin, and age through an AI-powered prediction model."
            comingSoon={true}
          />
        </div>

        {/* Breast Cancer */}

        <div
          className="card-item card-item-disabled"
          onClick={() =>
            toast.info("Breast Cancer predictor is coming soon!")
          }
        >
          <Card
            video="/breast-cancer-video.mp4"
            title="Breast Cancer"
            description="Predict breast cancer risk using deep learning models trained on histopathological image datasets for early diagnosis."
            comingSoon={true}
          />
        </div>

      </div>
    </section>
  );
}

export default PredictorsPage;
