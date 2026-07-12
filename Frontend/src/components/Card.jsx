import PropTypes from "prop-types";

function Card({
  image,
  icon,
  video,
  title,
  description,
  comingSoon,
}) {
  return (
    <div
      className={`card ${
        comingSoon ? "card-coming-soon" : ""
      }`}
    >
      {/* ================= HERO ================= */}

      <div className="card-media">

        {video ? (
          <video
            className="card-video"
            src={video}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : image ? (
          <img
            src={image}
            alt={title}
            className="card-image"
          />
        ) : (
          <div className="card-icon-placeholder">
            {icon}
          </div>
        )}

        {comingSoon && (
          <span className="card-badge">
            Coming Soon
          </span>
        )}

      </div>

      {/* ================= CONTENT ================= */}

      <div className="card-content">

        {/* <span className="card-small-badge">
          🩺 AI Healthcare
        </span> */}

        <h2 className="card-title">
          {title}
        </h2>

        <p className="card-description">
          {description}
        </p>

        {/* ================= STATS ================= */}

        <div className="card-stats">

          <div className="card-stat">

            <span className="stat-value">
              AI
            </span>

            <span className="stat-label">
              Model
            </span>

          </div>

          <div className="card-stat">

            <span className="stat-value">
              &lt;30s
            </span>

            <span className="stat-label">
              Analysis
            </span>

          </div>

          <div className="card-stat">

            <span className="stat-value">
              100%
            </span>

            <span className="stat-label">
              Secure
            </span>

          </div>

        </div>

        {/* ================= FEATURES ================= */}

        <div className="card-features">

          <span className="feature-chip">
            🤖 AI Powered
          </span>

          <span className="feature-chip">
            ⚡ Fast
          </span>

          <span className="feature-chip">
            🔒 Privacy
          </span>

          <span className="feature-chip">
            📊 Smart Insights
          </span>

        </div>

        {/* ================= BUTTON ================= */}

        {/* FIXED : removed onClick={(e) => e.stopPropagation()}
            it was blocking the click from ever reaching the
            parent .card-item div, which is what actually
            performs the navigation - that's why clicking the
            button did nothing while clicking anywhere else on
            the card worked fine. */}
        <button
          type="button"
          disabled={comingSoon}
          className={`card-button ${
            comingSoon
              ? "card-button-disabled"
              : ""
          }`}
        >
          {comingSoon ? (
            <>
              Coming Soon
            </>
          ) : (
            <>
              Start Assessment

              <span className="card-arrow">
                →
              </span>
            </>
          )}

        </button>

      </div>

    </div>
  );
}

Card.propTypes = {
  image: PropTypes.string,
  icon: PropTypes.node,
  video: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  comingSoon: PropTypes.bool,
};

Card.defaultProps = {
  image: null,
  icon: null,
  video: null,
  comingSoon: false,
};

export default Card;