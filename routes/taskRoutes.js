const express = require("express");
const authMiddlewere = require("../middleware/authMiddleware");
const {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getAllUserTasks
} = require("../controllers/taskControllers");

const router = express.Router();

router.post("/:projectId/create", authMiddlewere, createTask);
router.get("/:projectId/myTasks", authMiddlewere, getTasksByProject);
router.get("/all", authMiddlewere, getAllUserTasks);
router.patch("/:taskId/update", authMiddlewere, updateTask);
router.delete("/:taskId/delete", authMiddlewere, deleteTask);

module.exports = router;
