require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors());

// ================= CONFIG =================
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "secret123";
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lostfound";

// ================= DB CONNECTION =================
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ================= MODELS =================

// USER MODEL
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", userSchema);

// ITEM MODEL (Lost & Found)
const itemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  itemName: String,
  description: String,
  type: String, // Lost / Found
  location: String,
  date: {
    type: Date,
    default: Date.now
  },
  contact: String
});

const Item = mongoose.model("Item", itemSchema);

// ================= AUTH MIDDLEWARE =================
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ================= ROUTES =================

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("🚀 Backend running successfully");
});

// ================= AUTH ROUTES =================

// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ITEM ROUTES =================

// ADD ITEM (Protected)
app.post("/api/items", authMiddleware, async (req, res) => {
  try {
    const { itemName, description, type, location, contact } = req.body;

    if (!itemName) {
      return res.status(400).json({ message: "Item name required" });
    }

    const item = new Item({
      userId: req.user.id,
      itemName,
      description,
      type,
      location,
      contact
    });

    await item.save();

    res.json({
      message: "Item added successfully",
      data: item
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL ITEMS
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find().sort({ date: -1 });
    res.json(items);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ITEM BY ID
app.get("/api/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE ITEM
app.put("/api/items/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Item updated",
      data: item
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE ITEM
app.delete("/api/items/:id", authMiddleware, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: "Item deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEARCH ITEM
app.get("/api/items/search", async (req, res) => {
  try {
    const { name } = req.query;

    const items = await Item.find({
      itemName: { $regex: name, $options: "i" }
    });

    res.json(items);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});