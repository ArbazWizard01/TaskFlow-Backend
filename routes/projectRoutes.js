const express = require("express");
const authMiddlawere = require("../middleware/authMiddleware");
const {
  createProject,
  getProjects,
  getProjectById,
  deleteProject
} = require("../controllers/projectControllers");

const router = express.Router();

router.post("/create", authMiddlawere, createProject);
router.get("/myProjects", authMiddlawere, getProjects);
router.get("/:projectId", authMiddlawere, getProjectById);
router.delete("/:projectId/delete", authMiddlawere, deleteProject);

module.exports = router;
