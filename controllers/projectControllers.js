const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const createProject = async (req, res) => {
  try {
    const db = getDB();
    const projectCollection = await db.collection("projects");

    const userId = req.user.id;
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Project title is required!" });
    }

    const projectCount = await projectCollection.countDocuments({
      userId: new ObjectId(userId),
    });
    if (projectCount >= 4) {
      return res.status(400).json({ message: "Limit of 4 projects reached" });
    }
    console.log("📩 Incoming Request:", req.body);
    const newProject = {
      userId: new ObjectId(userId),
      title,
      description: description || "",
      status: status || "todo",
      createdAt: new Date(),
    };

    const result = await projectCollection.insertOne(newProject);

    res.status(201).json({
      message: "✅ Project created successfully",
      project: { ...newProject, _id: result.insertedId },
    });
  } catch (error) {
    console.error("❌ Project Creation Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const db = getDB();
    const projectCollection = await db.collection("projects");
    const userId = req.user.id;

    const projects = await projectCollection.find({ userId: new ObjectId(userId) }).toArray();

    res.status(200).json(projects);
  } catch (error) {
    console.error("❌ Project Listing Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const db = getDB();
    const projectCollection = db.collection("projects");
    const { projectId } = req.params;

    const project = await projectCollection.findOne({
      _id: new ObjectId(projectId),
      userId: new ObjectId(req.user.id), // security: only access your own projects
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("❌ Failed to get project:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = { createProject, getProjects, getProjectById };
