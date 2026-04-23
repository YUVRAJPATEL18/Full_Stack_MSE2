require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());

app.use(cors({
  origin: "*", // change to frontend URL in production
}));

// ================= CONFIG =================
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// ================= DB CONNECTION =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ================= SCHEMAS =================

// USER
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model("User", userSchema);

// EXPENSE
const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: String,
  amount: Number,
  category: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const Expense = mongoose.model("Expense", expenseSchema);

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
    res.status(401).json({ message: "Invalid Token" });
  }
};

// ================= ROUTES =================

// TEST
app.get("/", (req, res) => {
  res.send("🚀 Backend running");
});

// ================= AUTH =================

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
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
app.post("/api/auth/login", async (req, res) => {
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

// ================= EXPENSE =================

// ADD EXPENSE
app.post("/api/expense", authMiddleware, async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: "Title & amount required" });
    }

    const expense = new Expense({
      userId: req.user.id,
      title,
      amount,
      category
    });

    await expense.save();

    res.json({
      message: "Expense added",
      data: expense
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET EXPENSES
app.get("/api/expenses", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.user.id
    });

    res.json(expenses);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE EXPENSE
app.delete("/api/expense/:id", authMiddleware, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);

    res.json({ message: "Expense deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});