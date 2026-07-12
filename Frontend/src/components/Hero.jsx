import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">

      {/* ===== UPDATED : Left Content ===== */}
      <div className="hero-content">

        {/* NEW : Badge */}

        {/* <span className="hero-badge">
          🚀 AI-Powered Healthcare Platform
        </span> */}

        {/* UPDATED : Better Heading */}
        
  <h1>
    Predict Diseases 
    <br />
    with <span>Artificial Intelligence</span>
</h1>

        {/* UPDATED : Better Description */}
        <p>
          Get instant AI-assisted predictions for Heart Disease,
          Diabetes, Lung Cancer, and Breast Cancer using advanced
          machine learning models designed to provide fast,
          reliable, and intelligent healthcare support.
        </p>

        {/* UPDATED : Two Buttons */}
        <div className="hero-buttons">

          {/* OLD
          <Link to="/predictors" style={{ textDecoration: "none" }}>
            <div className="pos">
              <button className="btn btn-primary">
                Start Free Diagnosis
              </button>
            </div>
          </Link>
          */}

          {/* NEW : Primary Button */}
          <Link
            to="/predictors"
            style={{ textDecoration: "none" }}
          >
            <button className="btn btn-primary">
              Start Free Diagnosis
            </button>
          </Link>

          {/* NEW : Secondary Button */}
          {/* OLD
          <Link
            to="/about"
            style={{ textDecoration: "none" }}
          >
            <button className="btn hero-secondary-btn">
              Learn More
            </button>
          </Link>
          */}
          <button
            className="btn hero-secondary-btn"
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Learn More
          </button>

        </div>

        {/* ===== REMOVED : Watch Demo link + modal
             (video now plays directly in the hero image slot instead) ===== */}

        {/* NEW : Statistics */}
        <div className="hero-stats">

          <div className="stat-card">
            <h3>98.7%</h3>
            <p>Prediction Accuracy</p>
          </div>

          <div className="stat-card">
            <h3>4+</h3>
            <p>Disease Models</p>
          </div>

          <div className="stat-card">
            <h3>24/7</h3>
            <p>AI Assistance</p>
          </div>

        </div>

      </div>

      {/* ===== UPDATED : Right Side - video instead of static image ===== */}
      <div className="hero-image">
        {/* OLD
        <img
          src={homepageImage}
          alt="AI-Powered Multi-Disease Prediction Platform"
        />
        */}
        <video
          className="hero-video"
          src="/demo-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </div>

    </section>
  );
}

export default Hero;
