const express = require("express");
const authMiddlewere = require("../middleware/authMiddleware");
const {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getAllUserTasks,
  getSummery,
  countGroupTasks
} = require("../controllers/taskControllers");

const router = express.Router();

router.post("/:projectId/create", authMiddlewere, createTask);
router.get("/summary", authMiddlewere, getSummery);
router.get("/countGroupTasks", authMiddlewere, countGroupTasks);
router.get("/:projectId", authMiddlewere, getTasksByProject);
router.patch("/:taskId/update", authMiddlewere, updateTask);
router.delete("/:taskId/delete", authMiddlewere, deleteTask);

module.exports = router;
