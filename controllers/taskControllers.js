const { error } = require("console");
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const createTask = async (req, res) => {
  try {
    const db = getDB();
    const taskCollection = await db.collection("tasks");
    const { title, description, status } = req.body;
    const { projectId } = req.params;

    if (!title || !projectId) {
      return res
        .status(400)
        .json({ message: "title and projectId are required" });
    }

    const newTask = {
      title,
      description: description || "",
      status: status || "todo",
      createdAt: new Date(),
      completedAt: null,
      projectId: new ObjectId(projectId),
      userId: new ObjectId(req.user.id),
    };

    const result = await taskCollection.insertOne(newTask);
    res
      .status(201)
      .json({ message: "✅ Task created", taskId: result.insertedId });
  } catch (error) {
    console.error("❌ Task creation failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTasksByProject = async (req, res) => {
  try {
    const db = getDB();
    const taskCollection = await db.collection("tasks");
    const { projectId } = req.params;

    const tasks = await taskCollection
      .find({
        projectId: new ObjectId(projectId),
        userId: new ObjectId(req.user.id),
      })
      .toArray();

    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Failed to fetch tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllUserTasks = async (req, res) => {
  try {
    const db = getDB();
    const taskCollection = await db.collection("tasks");

    const tasks = await taskCollection
      .find({ userId: new ObjectId(req.user.id) })
      .toArray();

    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Failed to fetch user tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updateTask = async (req, res) => {
  try {
    const db = getDB();
    const taskCollection = await db.collection("tasks");

    const { taskId } = req.params;
    const { title, description, status, completedAt } = req.body;

    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (status) {
      updateFields.status = status;

      if (status === "completed") {
        updateFields.completedAt = new Date();
      } else {
        updateFields.completedAt = null;
      }
    }
    if (completedAt) updateFields.completedAt = completedAt;

    const result = await taskCollection.updateOne(
      { _id: new ObjectId(taskId), userId: new ObjectId(req.user.id) },
      { $set: updateFields }
    );
    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "Task not found pr Unauthorized" });
    }
    res.status(201).json({ message: "✅ Task updated successfully" });
  } catch (error) {
    console.error("Update Error: ", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const db = getDB();
    const taskCollection = db.collection("tasks");

    const { taskId } = req.params;

    const result = await taskCollection.deleteOne({
      _id: new ObjectId(taskId),
      userId: new ObjectId(req.user.id),
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    res.json({ message: "🗑️ Task deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = { createTask, getTasksByProject, updateTask, deleteTask, getAllUserTasks };
