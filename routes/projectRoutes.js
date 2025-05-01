const express = require("express");
const authMiddlawere = require("../middleware/authMiddleware");
const {
  createProject,
  getProjects,
  getProjectById,
} = require("../controllers/projectControllers");

const router = express.Router();

router.post("/create", authMiddlawere, createProject);
router.get("/myProjects", authMiddlawere, getProjects);
router.get("/:projectId", authMiddlawere, getProjectById);

module.exports = router;
