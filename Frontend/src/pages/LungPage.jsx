import { useState } from "react";
import "../App.css";
import "../styles/lungpage.css";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { FiFileText, FiUpload } from "react-icons/fi";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LungPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
  });

  const [predictionResult, setPredictionResult] = useState("");
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  const [showDummyModal, setShowDummyModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  /* ===================== FORM HANDLERS ===================== */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImageUploaded(true);
      setError("");
    } else {
      setError("Please upload a valid CT Scan image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      setError("Please upload a CT Scan image.");
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("image", imageFile);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("gender", formData.gender);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/predict/lung-pred`, {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }

      const data = await response.json();

      if (data.prediction) {
        setPredictionResult(data.prediction);
        setShowResult(true);
        setError("");
        fetchAiSuggestion(data.prediction);
      } else {
        throw new Error("Prediction failed.");
      }
    } catch (err) {
      console.error(err);
      setPredictionResult("");
      setShowResult(false);
      setError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== AI SUGGESTION ===================== */

  const fetchAiSuggestion = async (prediction) => {
    setAiLoading(true);
    setAiSuggestion("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/ai/suggestion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          disease: "Lung Cancer",
          prediction,
          age: formData.age,
          gender: formData.gender === "M" ? "Male" : "Female",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setAiSuggestion(data.suggestion);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  /* ===================== RESET FORM ===================== */

  const handleRePredict = () => {
    setShowResult(false);
    setPredictionResult("");
    setFormData({ name: "", age: "", gender: "" });
    setImageFile(null);
    setImageUploaded(false);
    setAiSuggestion("");
    setError("");
  };

  /* ===================== PDF DOWNLOAD ===================== */

  const generateDynamicPDF = async () => {
    try {
      const existingPdfBytes = await fetch("/Report.pdf").then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const page = pdfDoc.getPages()[0];
      const { height } = page.getSize();

      const details = [
        ["Name", formData.name],
        ["Age", formData.age],
        ["Gender", formData.gender === "M" ? "Male" : "Female"],
        ["Prediction", predictionResult],
      ];

      let y = height - 250;

      details.forEach(([label, value]) => {
        page.drawText(`${label}: ${value}`, {
          x: 55,
          y,
          size: 15,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        y -= 26;
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lung_disease_report.pdf";
      a.click();
    } catch (err) {
      console.error(err);
      setError("Unable to generate report.");
    }
  };
const isHealthy = predictionResult.toLowerCase().includes("not");
  /* ===================== JSX ===================== */

  return (
    // <div className="lung-page">
    <div className="lung-page fade-in">
      {/* Loader */}
      <div
        className="loader-overlay"
        style={{ display: loading ? "flex" : "none" }}
      >
        {/* <Loader type="TailSpin" color="#00F5D4" height={70} width={70} /> */}
        <Loader
  type="TailSpin"
  color="#22D3EE"
  height={70}
  width={70}
  
/>
<Loader type="TailSpin" color="#22D3EE" height={70} width={70} />
<p style={{ color: "#6f271f", marginTop: "1rem" }}>
  Analyzing scan with AI model... this can take up to a minute.
</p>
      </div>

      {/* Hero */}
      <section className="lung-hero">
        <span className="lung-badge">🫁 AI Powered Diagnosis</span>
        <h1>
          Lung Cancer
          <span> Predictor</span>
        </h1>
        <p>
          Upload a Chest CT Scan and receive an AI-powered prediction using
          our Deep Learning model built for rapid and intelligent lung
          cancer screening.
        </p>
      </section>

      {!showResult ? (
        <form className="lung-form" onSubmit={handleSubmit}>
          {/* Patient Information */}
          <div className="lung-section">
            <div className="section-header">
              <h2>Patient Information</h2>
              <p>Enter the patient's details before running the AI prediction.</p>
            </div>

            <div className="lung-grid">
              <div className="lung-input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="lung-input-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  placeholder="32"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="lung-input-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Upload */}
          <div className="lung-section">
            <div className="section-header">
              <h2>Chest CT Scan</h2>
              <p>Upload a CT Scan image for AI analysis.</p>
            </div>

            <div className="upload-box">
              <div className="upload-icon">
                <FiUpload />
              </div>
              <h3>
                {imageUploaded ? "Image Uploaded Successfully" : "Upload Chest CT Scan"}
              </h3>
              <p>
                {imageUploaded ? imageFile?.name : "Supported formats: JPG • PNG • JPEG"}
              </p>
              <label htmlFor="upload-image" className="upload-btn">
                Choose Image
                <input
                  id="upload-image"
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  hidden
                  required
                />
              </label>
            </div>

            <div className="lung-action-buttons">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowModal(true)}
              >
                <FiFileText />
                Test Images
              </button>

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Predicting..." : "Start AI Prediction"}
              </button>
            </div>

            {/* Test Images Modal */}
            {showModal && (
              <div className="lung-modal-overlay">
                <div className="lung-modal">
                  <h2>Sample CT Scan Images</h2>
                  <p>
                    Download the sample CT Scan images below and use them for
                    testing the AI model.
                  </p>

                  <div className="lung-modal-buttons">
                    <a
                      href="/ReportTemplate/Lung/Lung_Cancerous.zip"
                      download
                      className="primary-btn"
                    >
                      Cancerous Images
                    </a>
                    <a
                      href="/ReportTemplate/Lung/Lung_NonCancerous.zip"
                      download
                      className="secondary-btn"
                    >
                      Normal Images
                    </a>
                  </div>

                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Dummy Modal */}
            {showDummyModal && (
              <div className="lung-modal-overlay">
                <div className="lung-modal">
                  <h2>Dummy Test Images</h2>
                  <p>Use these sample images to test the predictor.</p>

                  <div className="lung-modal-buttons">
                    <a href="/dummy/lung/suffering.zip" download className="primary-btn">
                      Cancer
                    </a>
                    <a
                      href="/dummy/lung/non_suffering.zip"
                      download
                      className="secondary-btn"
                    >
                      Normal
                    </a>
                  </div>

                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setShowDummyModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      ) : (
        <section className="prediction-result">
          <div className="result-card">
            <span className="result-badge">AI Prediction</span>
            <h2>Prediction Result</h2>

            <div className="patient-info">
              <div>
                <strong>Name</strong>
                <span>{formData.name}</span>
              </div>
              <div>
                <strong>Age</strong>
                <span>{formData.age}</span>
              </div>
              <div>
                <strong>Gender</strong>
                <span>{formData.gender === "M" ? "Male" : "Female"}</span>
              </div>
            </div>

            <div
              // className={`prediction-status ${
              //   predictionResult.toLowerCase().includes("not suffering")
              //     ? "healthy"
              //     : "danger"
              // }`}
               className={`prediction-status ${
               isHealthy ? "healthy" : "danger"
               }`}
              >
              {predictionResult}
            </div>

            <div className="ai-card">
              <div className="ai-card-header">✨ AI Health Insight</div>

              {aiLoading ? (
                <p className="ai-loading">Generating personalized recommendations...</p>
              ) : aiSuggestion ? (
                <p className="ai-text">{aiSuggestion}</p>
              ) : (
                <p className="ai-text">
                  AI insights are currently unavailable. Please consult a
                  qualified medical professional.
                </p>
              )}
            </div>

            <div className="result-buttons">
              <button className="secondary-btn" onClick={handleRePredict}>
                Re-Predict
              </button>
              <button className="primary-btn" onClick={generateDynamicPDF}>
                Download Report
              </button>
            </div>
          </div>
        </section>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default LungPage;


