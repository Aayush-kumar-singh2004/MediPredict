// require('dotenv').config({path:'./env'})
import dotenv from "dotenv";
import os from "os";
import { app } from "./app.js";
import connectDB from "./db/index.js";

//uncomment after deployment
// dotenv.config({ path: "./env" });

//remove after deployement
dotenv.config();


// const _dirname = path.dirname("");

// // use only for  production build ke liye hota hai
// const frontendBP = path.join(_dirname, "../Frontend/dist");
// app.use(express.static(frontendBP));

// Function to get the local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over internal (i.e., 127.0.0.1) and non-IPv4 addresses
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "http://localhost/"; // Fallback to localhost if no external IPv4 address is found
}


connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
      const ip = getLocalIpAddress();
      console.log(`Server running at http://${ip}:${process.env.PORT}/`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed !!!", err);
  });
