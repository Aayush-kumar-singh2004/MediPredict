
import { spawn } from "child_process";
import fs from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

//--------------------------------------------------
// DIR SETUP
//--------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//--------------------------------------------------
// SAFE DELETE
//--------------------------------------------------
const safeDelete = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting PDF:", err);
      else console.log("PDF file deleted successfully");
    });
  }
};

//--------------------------------------------------
// HEART PDF SCRAPER
//--------------------------------------------------
export const heartScraper = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF uploaded" });
    }

    const pdfPath = resolve(
      __dirname,
      "..",
      "uploads",
      req.file.filename
    );

    const pythonPath = resolve(
      __dirname,
      "../DataScrapingScripts/scrapHeart.py"
    );

    const pythonProcess = spawn("python", [
      pythonPath,
      pdfPath,
    ]);

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python stderr:", data.toString());
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      safeDelete(pdfPath);

      if (code !== 0) {
        return res.status(500).json({
          error: "PDF processing failed",
          details: errorOutput,
        });
      }

      try {
        const extractedData = JSON.parse(output);
        return res.status(200).json(extractedData);
      } catch (err) {
        return res.status(500).json({
          error: "Invalid JSON from Python",
          raw: output,
        });
      }
    });

  } catch (err) {
    console.error("Heart PDF Controller Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



