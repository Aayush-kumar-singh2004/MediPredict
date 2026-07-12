import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import aiRouter from "./routes/ai.routes.js";
import pdfRouter from "./routes/pdf.routes.js"; // Import pdfRoutes
import predRouter from "./routes/prediction.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN.split(",");

//remove after deployment
// const allowedOrigins = process.env.CORS_ORIGIN
//   ? process.env.CORS_ORIGIN.split(",")
//   : ["*"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow requests with no origin, like mobile apps or curl requests
      if (
        allowedOrigins.indexOf("*") !== -1 ||
        allowedOrigins.indexOf(origin) !== -1
      ) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

//replcae with your url
// app.use(cors({ origin: "https://predicti-x-v2.vercel.app", credentials: true }));

// Configurations for different types of data acceptance
// Limiting json data acceptance
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/predict", predRouter);
app.use("/api/pdf", pdfRouter);// Add this line to include the new PDF routes
app.use("/api/v1/ai", aiRouter);

export { app };
