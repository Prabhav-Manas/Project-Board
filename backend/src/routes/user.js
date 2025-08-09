const express = require("express");
const upload = require("../middlewares/multerConfig");
const userController = require("../controllers/user");

const router = express.Router();

router.post("/signup", upload.single("image"), userController.createUser);
router.post("/signin", userController.signInUser);

router.get("/verify-email/:token", userController.verifyEmail);

router.post("/forgot-password", userController.forgotPassword);

router.post("/reset-password/:token", userController.resetPassword);

module.exports = router;
