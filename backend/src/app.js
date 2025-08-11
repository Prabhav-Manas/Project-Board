require("dotenv").config();
const FRONTEND = (process.env.FRONTEND_URL || "http://localhost:4200").replace(/\/+$/, "");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const projectRoute = require("./routes/project");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const cors = require("cors");
const app = express();

const corsOptions = {
  origin: FRONTEND,
  methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected");
  }).catch((err) => {
    console.log("Failed to Connect", err.message);
  });

// ---Ensure the 'images' directory exists inside 'dist' folder---
const imagesDir = path.join(__dirname, "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true }); // Create the 'images' folder if it doesn't exist
}

// Serve Static Files for Uploaded Images
app.use("/images", express.static(imagesDir)); // Serving images from 'dist/images'

// Error Handling Middleware for Image Upload
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.log("Multer Error:", err.message);
    return res
      .status(400)
      .json({ message: "File upload error", error: err.message });
  } else if (err.message === "Invalid mime type") {
    console.log("Invalid MIME Type:", err.message);
    return res
      .status(400)
      .json({ message: "Invalid file type", error: err.message });
  } else {
    console.log("Internal Error:", err.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// Define a route for the root (`/`) path to return a JSON response
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Emp-App Backend!" });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoute);
// app.use("/api/employees", employeeRoutes);

module.exports = app;
