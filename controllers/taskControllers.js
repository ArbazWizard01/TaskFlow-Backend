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
    console.log("summery user: ", req.user);
    if (!ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const userId = new ObjectId(req.user.id);

    const tasks = await taskCollection.find({ userId: userId }).toArray();

    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Failed to fetch user tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getSummery = async (req, res) => {
  try {
    const db = getDB();
    const taskCollection = await db.collection("tasks");
    console.log("summery user: ", req.user);
    if (!ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const userId = new ObjectId(req.user.id);
    const result = await taskCollection
      .aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $group: {
            _id: "$status",
            count: {
              $count: {},
            },
          },
        },
      ])
      .toArray();
    console.log("result: ", result);
    const output = {};
    result.forEach((Element) => {
      switch (Element._id) {
        case "In Progress":
          output.inProgress = Element.count;
          break;
        case "Todo":
          output.todo = Element.count;
          break;
        case "Completed":
          output.completed = Element.count;
          break;
      }
    });
    res.status(200).json(output);
  } catch (error) {
    console.error("❌ Failed to fetch user tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const countGroupTasks = async (req, res) => {
  try {
    const db = getDB();
    const taskCollection = db.collection("tasks");

    if (!ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userId = new ObjectId(req.user.id);

    const result = await taskCollection
      .aggregate([
        {
          $match: { userId },
        },
        {
          $group: {
            _id: "$projectId",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    // Format it as a key-value object: { projectId1: count1, projectId2: count2 }
    const output = {};
    result.forEach((group) => {
      output[group._id] = group.count;
    });

    res.status(200).json(output);
  } catch (error) {
    console.error("❌ Failed to fetch grouped task counts:", error);
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

module.exports = {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getAllUserTasks,
  getSummery,
  countGroupTasks,
};
