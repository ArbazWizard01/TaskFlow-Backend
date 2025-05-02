const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getDB } = require("../config/db");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const db = getDB();
    const userCollection = await db.collection("users");
    const { name, email, country, password } = req.body;
    console.log("📩 Incoming Request:", req.body);

    if (!name || !email || !country || !password) {
      return res.status(400).json({ message: "All fields ar required" });
    }

    const extingUser = await userCollection.findOne({ email });
    if (extingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      country,
      password: hashedPassword,
      projects: [],
    };

    const result = await userCollection.insertOne(newUser);

    const token = await jwt.sign(
      { id: result.insertedId.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "✅ User registered successfully",
      token,
      user: {
        id: result.insertedId,
        name,
        email,
        country,
        projects: [],
      },
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const db = getDB();
    const userCollection = db.collection("users");
    const { email, password } = req.body;

    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credential!" });
    }

    const token = await jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        country: user.country,
        projects: user.projects,
      },
      message: "✅ User login successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = { registerUser, loginUser };
