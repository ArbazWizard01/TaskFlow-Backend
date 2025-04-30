const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const createProject = async (req, res) => {
  try {
    const db = getDB();
    const projectCollection = await db.collection("projects");

    const userId = req.user.id;
    const { title, description } = req.body;

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

module.exports = { createProject, getProjects };
