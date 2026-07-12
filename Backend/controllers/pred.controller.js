import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import path from "path";
import fs from "fs";
import multer from "multer";

// Set up multer for file uploads

// Get the directory path of the current ES module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//------------------------------------

// import multer from "multer";
// MULTER CONFIG

// ===== FIX : ensure the uploads directory exists before multer
// tries to write into it. On Render (and most container platforms)
// the filesystem starts fresh each deploy - an empty folder never
// gets committed to git, so it doesn't exist until we create it. =====
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export { upload };

// Define the relative path to the heartpredict.py script
// PYTHON SCRIPT PATHS
const heartPath = resolve(
  __dirname,
  "../ML/Heart Disease Prediction/heartpredict.py"
);

// Base URL of the persistent lung-prediction Python server.
// Set PY_SERVER_URL in your .env if you ever run it on a different
// host/port (e.g. a separate Render service). Defaults to localhost
// since server.py runs inside the same container/process group.
const LUNG_PREDICT_URL =
  process.env.PY_SERVER_URL || "http://127.0.0.1:6000/predict";

//HEART DISEASE PREDICTION
const heartpred = asyncHandler(async (req, res) => {
  try {
    const { p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13 } = req.body;

    // Condition check for p2: If male (assuming 1 for male and 0 for female)
    const transformedP2 = isNaN(p2)
      ? p2.toLowerCase() === "male"
        ? 1
        : 0
      : p2;

    // Condition check for p6: If yes (assuming 1 for yes and 0 for no)
    const transformedP6 = isNaN(p6) ? (p6.toLowerCase() === "yes" ? 1 : 0) : p6;

    const python = spawn("python", [
      heartPath,
      p1,
      transformedP2.toString(),
      p3,
      p4,
      p5,
      transformedP6.toString(),
      p7,
      p8,
      p9,
      p10,
      p11,
      p12,
      p13,
    ]);

    let predictionVal = "";

    python.stdout.on("data", (data) => {
      console.log("python stdout: ", data.toString());
      predictionVal = data.toString().trim();
    });

    python.stderr.on("data", (data) => {
      console.error("python stderr: ", data.toString());
    });

    python.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        res.status(500).json({ message: "Python script error" });
      } else {
        console.log("predictionVal: ", predictionVal);
        console.log(typeof predictionVal);
        if (predictionVal === "1") {
          res.json({
            prediction: predictionVal.trim(),
            result: "The person is suffering from Heart Disease",
          });
        } else if (predictionVal === "0") {
          res.json({
            prediction: predictionVal.trim(),
            result: "The person is not suffering from Heart Disease",
          });
        }
      }
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Failed to predict" });
  }
});

//lungpred
// ===== CHANGED =====
// Previously this spawned a brand-new `python predict.py <image>` process
// per request, which reloaded TensorFlow + LCD.h5 from scratch every time
// (12-30+ seconds) and repeatedly spiked memory past Render's 512MB free
// tier limit, getting silently OOM-killed ("Python exited with code: 1",
// no traceback). Now it makes a fast HTTP call to a persistent Python
// server (server.py) that loaded the model ONCE at startup.
const lungpred = asyncHandler(async (req, res) => {
  let filePath;

  try {
    if (!req.file) {
      throw new ApiError(400, "No image file uploaded");
    }

    filePath = path.resolve(__dirname, "..", "uploads", req.file.filename);
    console.log("Resolved file path:", filePath);

    let response;
    try {
      response = await fetch(LUNG_PREDICT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: filePath }),
        // Cold model warm-up already happens at server startup, so a
        // generous-but-bounded timeout is enough for normal inference.
        signal: AbortSignal.timeout(30000),
      });
    } catch (networkErr) {
      console.error("Could not reach prediction server:", networkErr.message);
      return res.status(503).json({
        error: "Prediction service unavailable. Please try again shortly.",
      });
    }

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      console.error("Prediction server error:", errBody);
      return res.status(500).json({ error: "Python execution failed" });
    }

    const data = await response.json();

    if (data.result === "cancerous") {
      return res.status(200).json({
        prediction: "Person is suffering from Lung Cancer",
      });
    }

    if (data.result === "non-cancerous") {
      return res.status(200).json({
        prediction: "Person is not suffering from Lung Cancer",
      });
    }

    return res.status(500).json({
      error: "Unexpected prediction output",
      raw: data,
    });

  } catch (error) {
    console.error("Lung prediction controller error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    // Always clean up the uploaded file, success or failure.
    if (filePath) {
      fs.unlink(filePath, () => {});
    }
  }
});

export { heartpred, lungpred };



// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// import { spawn } from "child_process";
// import { fileURLToPath } from "url";
// import { dirname, resolve } from "path";

// import path from "path";
// import fs from "fs";
// import multer from "multer";

// // Set up multer for file uploads

// // Get the directory path of the current ES module file
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// //------------------------------------

// // import multer from "multer";
// // MULTER CONFIG

// // ===== FIX : ensure the uploads directory exists before multer
// // tries to write into it. On Render (and most container platforms)
// // the filesystem starts fresh each deploy - an empty folder never
// // gets committed to git, so it doesn't exist until we create it. =====
// const uploadsDir = path.join(__dirname, "../uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });

// export { upload };

// // Define the relative path to the heartpredict.py script
// // PYTHON SCRIPT PATHS
// const heartPath = resolve(
//   __dirname,
//   "../ML/Heart Disease Prediction/heartpredict.py"
// );



// //HEART DISEASE PREDICTION
// const heartpred = asyncHandler(async (req, res) => {
//   try {
//     const { p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13 } = req.body;

//     // Condition check for p2: If male (assuming 1 for male and 0 for female)
//     const transformedP2 = isNaN(p2)
//       ? p2.toLowerCase() === "male"
//         ? 1
//         : 0
//       : p2;

//     // Condition check for p6: If yes (assuming 1 for yes and 0 for no)
//     const transformedP6 = isNaN(p6) ? (p6.toLowerCase() === "yes" ? 1 : 0) : p6;

//     const python = spawn("python", [
//       heartPath,
//       p1,
//       transformedP2.toString(),
//       p3,
//       p4,
//       p5,
//       transformedP6.toString(),
//       p7,
//       p8,
//       p9,
//       p10,
//       p11,
//       p12,
//       p13,
//     ]);

//     let predictionVal = "";

//     python.stdout.on("data", (data) => {
//       console.log("python stdout: ", data.toString());
//       predictionVal = data.toString().trim();
//     });

//     python.stderr.on("data", (data) => {
//       console.error("python stderr: ", data.toString());
//     });

//     python.on("close", (code) => {
//       if (code !== 0) {
//         console.error(`Python script exited with code ${code}`);
//         res.status(500).json({ message: "Python script error" });
//       } else {
//         console.log("predictionVal: ", predictionVal);
//         console.log(typeof predictionVal);
//         if (predictionVal === "1") {
//           res.json({
//             prediction: predictionVal.trim(),
//             result: "The person is suffering from Heart Disease",
//           });
//         } else if (predictionVal === "0") {
//           res.json({
//             prediction: predictionVal.trim(),
//             result: "The person is not suffering from Heart Disease",
//           });
//         }
//       }
//     });
//   } catch (error) {
//     console.error("Error", error);
//     res.status(500).json({ message: "Failed to predict" });
//   }
// });








//   //lungpred
// const lungpred = asyncHandler(async (req, res) => {
//   try {
//     if (!req.file) {
//       throw new ApiError(400, "No image file uploaded");
//     }

//     const filePath = path.resolve(
//       __dirname,
//       "..",
//       "uploads",
//       req.file.filename
//     );

//     console.log("Resolved file path:", filePath);

//     const pythonProcess = spawn("python", [
//       path.resolve(__dirname, "../ML/Lung Cancer Prediction/predict.py"),
//       filePath,
//     ]);

//     let stdoutData = "";
//     let stderrData = "";

//     pythonProcess.stdout.on("data", (data) => {
//       stdoutData += data.toString();
//     });

//     pythonProcess.stderr.on("data", (data) => {
//       // ⚠️ Only log, do NOT respond here
//       console.warn("Python warning:", data.toString());
//       stderrData += data.toString();
//     });

//     pythonProcess.on("close", (code) => {
//       // delete uploaded file
//       fs.unlink(filePath, () => {});

//       if (code !== 0) {
//         console.error("Python exited with code:", code);
//         return res.status(500).json({ error: "Python execution failed" });
//       }

//       const result = stdoutData.trim();

//       if (result === "cancerous") {
//         return res.status(200).json({
//           prediction: "Person is suffering from Lung Cancer",
//         });
//       }

//       if (result === "non-cancerous") {
//         return res.status(200).json({
//           prediction: "Person is not suffering from Lung Cancer",
//         });
//       }

//       return res.status(500).json({
//         error: "Unexpected prediction output",
//         raw: result,
//       });
//     });
//   } catch (error) {
//     console.error("Lung prediction controller error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
// export { heartpred, lungpred,};











// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// import { spawn } from "child_process";
// import { fileURLToPath } from "url";
// import { dirname, resolve } from "path";

// import path from "path";
// import fs from "fs";
// import multer from "multer";

// // Set up multer for file uploads

// // Get the directory path of the current ES module file
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// //------------------------------------

// // import multer from "multer";
// // MULTER CONFIG
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../uploads"));
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });

// export { upload };

// // Define the relative path to the heartpredict.py script
// // PYTHON SCRIPT PATHS
// const heartPath = resolve(
//   __dirname,
//   "../ML/Heart Disease Prediction/heartpredict.py"
// );



// //HEART DISEASE PREDICTION
// const heartpred = asyncHandler(async (req, res) => {
//   try {
//     const { p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13 } = req.body;

//     // Condition check for p2: If male (assuming 1 for male and 0 for female)
//     const transformedP2 = isNaN(p2)
//       ? p2.toLowerCase() === "male"
//         ? 1
//         : 0
//       : p2;

//     // Condition check for p6: If yes (assuming 1 for yes and 0 for no)
//     const transformedP6 = isNaN(p6) ? (p6.toLowerCase() === "yes" ? 1 : 0) : p6;

//     const python = spawn("python", [
//       heartPath,
//       p1,
//       transformedP2.toString(),
//       p3,
//       p4,
//       p5,
//       transformedP6.toString(),
//       p7,
//       p8,
//       p9,
//       p10,
//       p11,
//       p12,
//       p13,
//     ]);

//     let predictionVal = "";

//     python.stdout.on("data", (data) => {
//       console.log("python stdout: ", data.toString());
//       predictionVal = data.toString().trim();
//     });

//     python.stderr.on("data", (data) => {
//       console.error("python stderr: ", data.toString());
//     });

//     python.on("close", (code) => {
//       if (code !== 0) {
//         console.error(`Python script exited with code ${code}`);
//         res.status(500).json({ message: "Python script error" });
//       } else {
//         console.log("predictionVal: ", predictionVal);
//         console.log(typeof predictionVal);
//         if (predictionVal === "1") {
//           res.json({
//             prediction: predictionVal.trim(),
//             result: "The person is suffering from Heart Disease",
//           });
//         } else if (predictionVal === "0") {
//           res.json({
//             prediction: predictionVal.trim(),
//             result: "The person is not suffering from Heart Disease",
//           });
//         }
//       }
//     });
//   } catch (error) {
//     console.error("Error", error);
//     res.status(500).json({ message: "Failed to predict" });
//   }
// });








//   //lungpred
// const lungpred = asyncHandler(async (req, res) => {
//   try {
//     if (!req.file) {
//       throw new ApiError(400, "No image file uploaded");
//     }

//     const filePath = path.resolve(
//       __dirname,
//       "..",
//       "uploads",
//       req.file.filename
//     );

//     console.log("Resolved file path:", filePath);

//     const pythonProcess = spawn("python", [
//       path.resolve(__dirname, "../ML/Lung Cancer Prediction/predict.py"),
//       filePath,
//     ]);

//     let stdoutData = "";
//     let stderrData = "";

//     pythonProcess.stdout.on("data", (data) => {
//       stdoutData += data.toString();
//     });

//     pythonProcess.stderr.on("data", (data) => {
//       // ⚠️ Only log, do NOT respond here
//       console.warn("Python warning:", data.toString());
//       stderrData += data.toString();
//     });

//     pythonProcess.on("close", (code) => {
//       // delete uploaded file
//       fs.unlink(filePath, () => {});

//       if (code !== 0) {
//         console.error("Python exited with code:", code);
//         return res.status(500).json({ error: "Python execution failed" });
//       }

//       const result = stdoutData.trim();

//       if (result === "cancerous") {
//         return res.status(200).json({
//           prediction: "Person is suffering from Lung Cancer",
//         });
//       }

//       if (result === "non-cancerous") {
//         return res.status(200).json({
//           prediction: "Person is not suffering from Lung Cancer",
//         });
//       }

//       return res.status(500).json({
//         error: "Unexpected prediction output",
//         raw: result,
//       });
//     });
//   } catch (error) {
//     console.error("Lung prediction controller error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
// export { heartpred, lungpred,};


