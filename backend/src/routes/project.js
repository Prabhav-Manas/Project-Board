const express = require("express");
const projectController = require("../controllers/project");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/create-project", verifyToken, projectController.createProject);
router.get("/all-projects", verifyToken, projectController.allProjects);
router.get("/project/:id", verifyToken, projectController.getSingleProject);
router.patch("/edit-project/:id", verifyToken, projectController.updateProject);
router.delete(
  "/delete-project/:id",
  verifyToken,
  projectController.deleteProject
);

router.get("/search", projectController.searchProject);
module.exports = router;
