const multer = require("multer");
const path = require("path");
const fs = require("fs");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    if (!isValid) {
      return cb(new Error("Invalid mime type"), false); // Reject the file with an error
    }

    // Ensure the 'images' directory exists inside 'dist'
    const imagesDir = path.join(__dirname, "..", "images");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true }); // Create the directory if it doesn't exist
    }

    cb(null, imagesDir); // Save the file to 'dist/images'
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext); // Add a unique identifier for each file
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
