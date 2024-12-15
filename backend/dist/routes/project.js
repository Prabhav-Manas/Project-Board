"use strict";

var express = require("express");
var projectController = require("../controllers/project");
var verifyToken = require("../middlewares/verifyToken");
var router = express.Router();
router.post("/create-project", verifyToken, projectController.createProject);
router.get("/all-projects", verifyToken, projectController.allProjects);
router.get("/project/:id", verifyToken, projectController.getSingleProject);
router.patch("/edit-project/:id", verifyToken, projectController.updateProject);
router["delete"]("/delete-project/:id", verifyToken, projectController.deleteProject);
router.get("/search", projectController.searchProject);
module.exports = router;