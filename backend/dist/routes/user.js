"use strict";

var express = require("express");
var upload = require("../middlewares/multerConfig");
var userController = require("../controllers/user");
var router = express.Router();
router.post("/signup", upload.single("image"), userController.createUser);
router.post("/signin", userController.signInUser);
router.get("/verify-email/:token", userController.verifyEmail);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);
module.exports = router;