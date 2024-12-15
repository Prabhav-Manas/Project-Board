"use strict";

var multer = require("multer");
var path = require("path");
var fs = require("fs");
var MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    var isValid = MIME_TYPE_MAP[file.mimetype];
    if (!isValid) {
      return cb(new Error("Invalid mime type"), false); // Reject the file with an error
    }

    // Ensure the 'images' directory exists inside 'dist'
    var imagesDir = path.join(__dirname, "..", "images");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, {
        recursive: true
      }); // Create the directory if it doesn't exist
    }
    cb(null, imagesDir); // Save the file to 'dist/images'
  },
  filename: function filename(req, file, cb) {
    var name = file.originalname.toLowerCase().split(" ").join("-");
    var ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext); // Add a unique identifier for each file
  }
});
var upload = multer({
  storage: storage
});
module.exports = upload;