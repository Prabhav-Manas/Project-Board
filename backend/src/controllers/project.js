const Project = require("../models/project");

// Create New Project
exports.createProject = async (req, res, next) => {
  const { projectName, clientType, client, projectStatus } = req.body;

  try {
    if (!projectName || !clientType || !client || !projectStatus) {
      return res.status(400).json({
        message: "Invalid Input",
      });
    }

    const project = new Project({
      projectName,
      clientType,
      client,
      projectStatus,
      creater: req.user._id,
    });

    await project.save();

    res.status(201).json({
      message: "New Project has been created!",
    });
  } catch (error) {
    console.log("Error 💥:=>", error.message);
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

// Fetch All Projects
exports.allProjects = async (req, res, next) => {
  try {
    // Get the 'page' and 'limit' query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const project = await Project.find({ creater: req.user._id })
      .skip(skip)
      .limit(limit)
      .populate("creater", "email");

    const totalProject = await Project.countDocuments({
      creater: req.user._id,
    });

    if (!project || project.length === 0) {
      return res.status(404).json({
        message: "No project found!",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Project Found!",
      projects: project,
      totalProjects: totalProject,
      currentPage: page,
      totalPages: Math.ceil(totalProject / limit),
    });
  } catch (error) {
    console.log("Error 💥:=>", error.message);
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

// Fetch a Single Project
exports.getSingleProject = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await Project.findById({
      _id: id,
      creater: req.user._id,
    }).populate("creater", "email");

    if (!project || project.length === 0) {
      return res.status(404).json({
        message: "No project found!",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Project found by ID!",
      project: project,
    });
  } catch (error) {
    console.log("Error 💥:=>", error.message);
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

// Update Project
exports.updateProject = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { projectName, clientType, client, projectStatus } = req.body;

    if (!projectName || !clientType || !client || !projectStatus) {
      return res.status(400).json({
        message: "Invalid input. All fields are required.",
      });
    }

    const updatedProject = { projectName, clientType, client, projectStatus };

    const project = await Project.findByIdAndUpdate(
      { _id: id, creater: req.user._id },
      { $set: updatedProject },
      { new: true }
    );

    if (project) {
      res.status(200).json({
        status: 200,
        message: "Project update successful!",
        updatedProject: project,
      });
    } else {
      return res.status(404).json({
        message: "No project found!",
      });
    }
  } catch (error) {
    console.log("Error 💥:=>", error.message);
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

// Delete Project
exports.deleteProject = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await Project.findByIdAndDelete({
      _id: id,
      creater: req.usr._id,
    });

    if (project) {
      res.status(200).json({
        status: 200,
        message: "Project Deleted Successfully!",
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "Project not found!",
      });
    }
  } catch (error) {
    console.log("Error 💥:=>", error.message);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error!",
    });
  }
};

// Search Project
exports.searchProject = async (req, res, next) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({
        message: "Search Term required",
      });
    }

    // Perform a case-insensitive search using regex
    const project = await Project.find({
      projectName: { $regex: searchTerm, $options: "i" }, //Search by name field
    });

    res.status(200).json({
      project: project,
    });
  } catch (error) {
    console.log("Error during search 💥:=>", err.message);
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};
