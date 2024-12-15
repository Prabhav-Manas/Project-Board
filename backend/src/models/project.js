const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true, trim: true },
  clientType: {
    type: String,
    enum: ["individual", "company"],
    required: true,
    trim: true,
    set: (value) => value.toLowerCase(), // Store as lowercase
    get: (value) => value.charAt(0).toUpperCase() + value.slice(1), // Fetch as capitalized
  },
  client: { type: String, required: true, trim: true },
  projectStatus: {
    type: String,
    enum: ["new", "pending", "completed"],
    required: true,
    trim: true,
    set: (value) => value.toLowerCase(), // Store as lowercase
    get: (value) => value.charAt(0).toUpperCase() + value.slice(1), // Fetch as capitalized
  },
  creater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Ensure getters are applied when converting to JSON
projectSchema.set("toJSON", { getters: true });
projectSchema.set("toObject", { getters: true });

module.exports = mongoose.model("Projects", projectSchema);
