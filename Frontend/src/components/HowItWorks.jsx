import { FiUpload } from "react-icons/fi";
import { BsCpu, BsFileEarmarkMedical } from "react-icons/bs";
import { HiOutlineLightningBolt, HiOutlineSparkles } from "react-icons/hi";
import { FaStethoscope, FaInfoCircle } from "react-icons/fa";

function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works">
      <div className="how-it-works-inner">
        <div className="how-it-works-header">
          <span className="how-it-works-badge">How it works</span>
          <h2>From upload to insight in three steps</h2>
        </div>

        <div className="how-it-works-steps">
          <div className="how-step">
            <div className="how-step-number how-step-number-blue">1</div>
            <FiUpload className="how-step-icon how-step-icon-blue" />
            <h3>Upload your scan</h3>
            <p>Upload a CT scan or enter clinical values manually.</p>
          </div>

          <div className="how-step">
            <div className="how-step-number how-step-number-purple">2</div>
            <BsCpu className="how-step-icon how-step-icon-purple" />
            <h3>AI model analyzes it</h3>
            <p>A trained ResNet or SVM model processes your data in seconds.</p>
          </div>

          <div className="how-step">
            <div className="how-step-number how-step-number-green">3</div>
            <BsFileEarmarkMedical className="how-step-icon how-step-icon-green" />
            <h3>Get your result and AI insight</h3>
            <p>See your prediction plus a plain-language AI-generated suggestion.</p>
          </div>
        </div>

        <div className="how-it-works-why">
          <p className="how-it-works-why-title">Why MediPredict</p>
          <div className="how-it-works-why-grid">
            <div className="why-item">
              <HiOutlineLightningBolt className="why-icon" />
              <div>
                <p className="why-item-title">Instant results</p>
                <p className="why-item-sub">No waiting, no installation needed.</p>
              </div>
            </div>

            <div className="why-item">
              <FaStethoscope className="why-icon" />
              <div>
                <p className="why-item-title">4 disease models</p>
                <p className="why-item-sub">Heart, lung, diabetes, breast cancer.</p>
              </div>
            </div>

            <div className="why-item">
              <HiOutlineSparkles className="why-icon" />
              <div>
                <p className="why-item-title">AI-generated suggestions</p>
                <p className="why-item-sub">Plain-language next steps after every result.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="how-it-works-disclaimer">
          <FaInfoCircle className="disclaimer-icon" />
          MediPredict is a decision-support tool, not a substitute for professional medical diagnosis.
        </p>
      </div>
    </section>
  );
}

export default HowItWorks;