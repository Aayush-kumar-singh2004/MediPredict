import { useState } from "react";
import {
  FaBrain,
  FaBullseye,
  FaEye,
  FaGithub,
  FaHeartbeat,
  FaInstagram,
  FaLinkedin,
  FaRobot,
  FaShieldAlt,
} from "react-icons/fa";

import Modal from "react-modal";

import "../styles/pages.css";

import team01 from "../assets/AboutImg/team-01.jpg";
import team02 from "../assets/AboutImg/team-02.jpg";
import team03 from "../assets/AboutImg/team-03.jpg";
import team04 from "../assets/AboutImg/team-04.jpg";

const teamMembers = [
  {
    imgUrl: team01,
    name: "Aayush Kumar Singh",
    position: "Full Stack Developer Lead\n(Specialized in Backend)",
    
    linkedin: "https://www.linkedin.com/in/aayushsingh2026",
    github: "https://github.com/Aayush-kumar-singh2004",
    instagram:
      "https://www.instagram.com/_mr_singh_004?igsh=a2VnbTBtcmpqNzR1",
  },
  {
    imgUrl: team02,
    name: "MD Masud Rashid",
    position: "Machine Learning Developer Lead",
    linkedin:
      "https://www.linkedin.com/in/md-masud-rashid-66a182263",
    github: "https://github.com/ursmasx",
    instagram: "",
  },
  {
    imgUrl: team03,
    name: "Satyajit Tudu",
    position: "Frontend Developer",
    linkedin: "",
    github: "https://github.com/satya312",
    instagram: "",
  },
  {
    imgUrl: team04,
    name: "Anwesha Ghosh",
    position: "Frontend Developer",
    linkedin:
      "https://www.linkedin.com/in/anwesha-ghosh-a8240a2a2",
    github: "https://github.com/Anwesha-Megha",
    instagram: "",
  },
];

Modal.setAppElement("#root");

function AboutPage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const openModal = (img) => {
    setSelectedImage(img);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage("");
  };

  return (
    <section className="about-page">

      {/* Background Glow */}

      <div className="about-bg-circle about-bg-one"></div>
      <div className="about-bg-circle about-bg-two"></div>

      <div className="about-container">

        {/* ================= HERO ================= */}

        <div className="about-header">

          <span className="about-badge">
            <FaRobot />
            AI Healthcare Platform
          </span>

          <h1>
            About <span>MediPredict</span>
          </h1>

          <p>
            MediPredict is an AI-powered healthcare platform designed
            to provide intelligent disease prediction using Machine
            Learning and Deep Learning models. Our goal is to assist
            users with early health assessment while making healthcare
            technology more accessible, secure, and user-friendly.
          </p>

        </div>

        {/* ================= MISSION ================= */}

        <div className="about-feature-grid">

          <div className="about-feature-card">
            <FaBullseye className="feature-icon" />

            <h3>Our Mission</h3>

            <p>
              Empower healthcare with Artificial Intelligence by
              delivering accurate, accessible, and intelligent disease
              prediction tools that support early diagnosis and better
              decision making.
            </p>

          </div>

          <div className="about-feature-card">

            <FaEye className="feature-icon" />

            <h3>Our Vision</h3>

            <p>
              To become one of the leading AI healthcare platforms
              helping millions of users receive faster preliminary
              health assessments powered by modern technology.
            </p>

          </div>

          <div className="about-feature-card">

            <FaBrain className="feature-icon" />

            <h3>AI Technology</h3>

            <p>
              Built using MERN Stack, Machine Learning models,
              Deep Learning techniques, and secure cloud deployment
              for reliable healthcare prediction services.
            </p>

          </div>

        </div>

        {/* ================= TEAM ================= */}

        <div className="team-section">

          <span className="about-small-title">
            Meet Our Experts
          </span>

          <h2>
            The <span>Brains Behind MediPredict</span>
          </h2>

          <div className="team-grid">

            {teamMembers.map((member, index) => (

              <div
                className="team-card"
                key={index}
              >

                <div
                  className="team-image"
                  onClick={() =>
                    openModal(member.imgUrl)
                  }
                >

                  <img
                    src={member.imgUrl}
                    alt={member.name}
                  />

                </div>

                <h3>{member.name}</h3>

                <p>{member.position}</p>

                <div className="team-social">

                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaLinkedin />
                    </a>
                  )}

                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaGithub />
                    </a>
                  )}

                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaInstagram />
                    </a>
                  )}

                </div>

              </div>

            ))}
            
          </div>

        </div>

        {/* ================= WHY CHOOSE US ================= */}

        <div className="why-section">

          <span className="about-small-title">
            Why Choose MediPredict
          </span>

          <h2>
            Intelligent Healthcare
            <span> Powered by AI</span>
          </h2>

          <div className="why-grid">

            <div className="why-card">

              <FaHeartbeat className="why-icon" />

              <h3>Accurate Prediction</h3>

              <p>
                Our machine learning models are trained on healthcare
                datasets to provide reliable disease prediction and
                assist in early risk assessment.
              </p>

            </div>

            <div className="why-card">

              <FaShieldAlt className="why-icon" />

              <h3>Secure Platform</h3>

              <p>
                Authentication, encrypted passwords, JWT security,
                and protected APIs ensure your healthcare data
                remains safe and private.
              </p>

            </div>

            <div className="why-card">

              <FaRobot className="why-icon" />

              <h3>AI Powered</h3>

              <p>
                Machine Learning and Deep Learning models work
                together to deliver intelligent healthcare
                assistance within seconds.
              </p>

            </div>

            <div className="why-card">

              <FaBrain className="why-icon" />

              <h3>Modern Technology</h3>

              <p>
                Built with the MERN Stack, Python,
                Artificial Intelligence and Cloud
                technologies for scalability and
                performance.
              </p>

            </div>

          </div>

        </div>

        {/* ================= CTA ================= */}

        <div className="about-cta">

          <h2>
            Building the Future of
            <span> AI Healthcare</span>
          </h2>

          <p>
            Our team is committed to combining Artificial Intelligence,
            Machine Learning and modern web technologies to create
            healthcare solutions that are intelligent, accessible,
            secure and easy to use.
          </p>

          <button className="about-btn">
            Explore MediPredict
          </button>

        </div>

      </div>

      {/* ================= IMAGE MODAL ================= */}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="about-modal-overlay"
        className="about-modal"
      >
        <button
          className="modal-close"
          onClick={closeModal}
        >
          ✕
        </button>

        <img
          src={selectedImage}
          alt="Team Member"
          className="modal-image"
        />

      </Modal>

    </section>
  );
}

export default AboutPage;
