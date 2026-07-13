# 🩺 MediPredict — AI-Powered Multi-Disease Prediction Platform

<p align="center">

![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.20-FF6F00?logo=tensorflow)
![Docker](https://img.shields.io/badge/Docker-Render-2496ED?logo=docker)
![License](https://img.shields.io/badge/License-Academic-blue)

</p>

MediPredict is an **AI-powered healthcare platform** that combines **Machine Learning**, **Deep Learning**, and **Generative AI** to provide **preliminary disease risk assessment**.

The platform currently provides **Lung Cancer prediction** from chest CT scan images using a trained **ResNet CNN model**, along with AI-generated medical explanations powered by **Google Gemini**.

Additional disease prediction modules (**Heart Disease, Diabetes, and Breast Cancer**) are currently under development.

---

# 🌐 Live Demo

> ⚠️ **Deployment Notice**
>
> The frontend and backend are successfully deployed on Vercel and Render for demonstration purposes.
>
> The complete Lung Cancer prediction pipeline works correctly when the project is executed locally. However, the deployed version cannot perform live predictions because the TensorFlow model file required for inference exceeds the practical resource limitations of Render's free hosting environment (CPU-only execution and deployment constraints for large ML models).
>
> All other application features—including authentication, AI chatbot, report generation, routing, and frontend functionality—remain fully deployed and operational.
>
> For full prediction functionality, please follow the local setup instructions below.

### Frontend

https://medi-predict-umber.vercel.app/

### Backend API

https://medipredict-ihoo.onrender.com

## 📌 Deployment Limitation

The deployed application demonstrates the complete full-stack architecture of MediPredict.

Due to the limitations of Render's free tier, the deep learning model used for Lung Cancer prediction cannot be executed reliably in the cloud deployment.

### Local Environment
- ✅ Lung Cancer prediction works
- ✅ Gemini AI explanation works
- ✅ PDF report generation works
- ✅ Authentication works
- ✅ Complete end-to-end pipeline works

### Cloud Deployment
- ✅ Frontend available
- ✅ Backend API available
- ✅ Authentication
- ✅ AI Chat
- ✅ Report Generation
- ❌ Lung Cancer prediction (TensorFlow model deployment limitation)


# ✨ Features

## 🫁 AI Lung Cancer Prediction

- Upload chest CT scan images
- Deep Learning prediction using ResNet CNN
- Near real-time inference
- Confidence-based prediction

---

## 🤖 Gemini AI Health Insights

After prediction, Gemini AI automatically generates

- Easy-to-understand explanation
- General health suggestions
- Lifestyle recommendations
- Medical disclaimer

---

## 💬 AI Health Chat Assistant

A floating ChatGPT-style assistant that supports

- Multi-turn conversation
- General health questions
- Gemini-powered responses

---

## 🔐 Authentication

- JWT Authentication
- Access Token
- Refresh Token
- HTTP-only Cookies
- Guest Login
- Protected Routes

---

## 📄 PDF Report Generation

Generate downloadable reports containing

- Prediction Result
- Disease Status
- AI Explanation
- Timestamp

---

## 🎨 Modern UI

- Responsive Design
- Dark / Light Theme
- Mobile Friendly
- Glassmorphism UI
- Smooth Animations

---

## 🚀 Future Modules

Coming Soon

- ❤️ Heart Disease Prediction
- 🩸 Diabetes Prediction
- 🎗 Breast Cancer Prediction

---

# 🚀 Project Highlights

- ✅ Full Stack MERN Application
- ✅ TensorFlow Deep Learning Integration
- ✅ Python + Node.js Communication
- ✅ Dockerized Backend
- ✅ Google Gemini AI Integration
- ✅ JWT Authentication
- ✅ Cloudinary Integration
- ✅ PDF Report Generation
- ✅ Responsive UI
- ✅ Dark Mode
- ✅ REST API Architecture

---

# 🏗 System Architecture

```
                User
                  │
                  ▼
          React Frontend
                  │
                  ▼
          Express REST API
                  │
      ┌───────────┴───────────┐
      │                       │
      ▼                       ▼
 TensorFlow Model       Gemini AI API
      │                       │
      └───────────┬───────────┘
                  ▼
            Final Response
                  │
                  ▼
          Prediction Report
```

---

# 🔒 Security Features

- JWT Authentication
- HTTP-only Cookies
- Password Hashing (bcrypt)
- Protected APIs
- Environment Variables
- CORS Protection
- File Upload Validation

---

# 🛠 Tech Stack

## Frontend
-HTML
-CSS
- React.js
- Vite
- React Router
- Axios
- React Toastify
- pdf-lib

---

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- Multer
- Cloudinary
- Google Gemini API

---

## Machine Learning

- Python
- TensorFlow
- Keras
- NumPy
- Scikit-learn
- Pandas

---

## Deployment

Frontend

- Vercel

Backend

- Docker
- Render

Database

- MongoDB Atlas

---

# 📂 Project Structure

```
MediPredict
│
├── Backend
│   ├── controllers
│   ├── routes
│   ├── middlewares
│   ├── models
│   ├── db
│   ├── ML
│   ├── uploads
│   ├── utils
│   ├── requirements.txt
│   ├── Dockerfile
│   └── index.js
|   |__ App.js
|   |__ Constant.js
|   |__ .env
│
└── Frontend
|   ├── src
|   |   |__ assets
|   │   ├── components
|   │   ├── pages
|   │   ├── context
|   │   ├── styles
|   |   |__ App.css
|   │   └── App.jsx
|   |   |__ main.jsx  
|   |__ .env  
|    └── vite.config.js
|
|___Document
|   |__Medipridict_Thesis
|
|___Medical Reports
|   |__ Lung Cancer
|       |__Dataset
|       |__Not Suffering
|       |__Suffering
|
|___ML
|   |__Lung Cancer Prediction
|       |__LCD.H5
|       |__predict.py
|
|___gitignore
| 
|___README.md

```
---

# 🔄 Application Workflow

```
CT Scan Image
       │
       ▼
Upload Image
       │
       ▼
Express Server
       │
       ▼
Python Prediction Script
       │
       ▼
TensorFlow Model
       │
       ▼
Prediction Result
       │
       ▼
Gemini AI Explanation
       │
       ▼
React Frontend
       │
       ▼
PDF Report
```

---

# 🌐 REST API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/v1/users/register | User Registration |
| POST | /api/v1/users/login | User Login |
| POST | /api/v1/predict | Lung Cancer Prediction |
| POST | /api/v1/ai | AI Health Chat |
| POST | /api/pdf | Generate PDF Report |

---

# 🚀 Getting Started

## Prerequisites

- Node.js 18+
- Python 3.x
- MongoDB Atlas
- Gemini API Key

---

## Clone Repository

```bash
git clone https://github.com/Aayush-kumar-singh2004/MediPredict.git

cd MediPredict
```

---

## Backend Setup

```bash
cd Backend

npm install

pip install -r requirements.txt
```

Create

```
Backend/.env
```

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

ACCESS_TOKEN_SECRET=

ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=

REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

GEMINI_API_KEY=

CORS_ORIGIN=http://localhost:5173
```

---

## Frontend Setup

```bash
cd ../Frontend

npm install
```

Create

```
Frontend/.env
```

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## Run Project

From Backend directory

```bash
npm run dev
```

Backend

```
http://localhost:5000
```

Frontend

```
http://localhost:5173
```

---

# 🧠 Machine Learning Models

| Disease | Model | Accuracy | Status |
|----------|-------|----------|--------|
| Lung Cancer | ResNet CNN | ~83% | ✅ Live |
| Heart Disease | Decision Tree | ~87% | 🚧 Under Development |
| Diabetes | SVM | Planned | 🚧 |
| Breast Cancer | CNN | Planned | 🚧 |

Dataset

- IQ-OTH/NCCD Lung Cancer CT Scan Dataset (Kaggle)

---


## ⚠️ Limitations

- The Lung Cancer prediction model executes successfully in the local development environment.
- The live cloud deployment cannot execute the TensorFlow model because of Render Free Tier resource limitations.
- Uploaded images are temporarily stored during inference and deleted after processing.
- Prediction results are intended for educational and research purposes only and should not replace professional medical diagnosis.

---

# 🔮 Future Scope

- Heart Disease Prediction
- Diabetes Prediction
- Breast Cancer Prediction
- OCR-based Medical Report Analysis
- User Prediction History
- GPU Deployment
- Email Report Sharing
- Doctor Recommendation Module
- Multilingual Support

- Deploy the deep learning inference service on a GPU-enabled cloud platform (AWS, GCP,   Azure, or Hugging Face Spaces).
- Containerize the ML inference service separately for scalable deployment.
- Optimize the TensorFlow model using TensorFlow Lite or ONNX to reduce deployment size.
---

# 🙏 Acknowledgements

- Google Gemini AI
- TensorFlow
- MongoDB Atlas
- Render
- Vercel
- Kaggle IQ-OTH/NCCD Dataset

---

# 👨‍💻 Team

| Name | Role |
|------|------|
| **Aayush Kumar Singh** | Full Stack & Backend Developer |
| **MD Masud Rashik** | Machine Learning Engineer |
| **Satyajit Tudu** | Frontend Engineer |
| **Anwesha Ghosh** | Frontend Engineer |

**Project Supervisor**

Subhashree Maity

Assistant Professor

Department of Computer Science & Engineering

Swami Vivekananda Institute of Science & Technology

Kolkata

---

# 📜 License

This project was developed as part of a B.Tech Final Year Project for academic purposes.

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

For issues or suggestions, please open a GitHub Issue.