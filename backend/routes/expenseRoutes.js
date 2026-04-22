const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

// ADD EXPENSE
router.post("/", auth, async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const expense = await Expense.create({
      userId: req.user.id,
      title,
      amount,
      category,
    });

    res.json(expense);

  } catch (err) {
    console.error("ADD ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET EXPENSES
router.get("/", auth, async (req, res) => {
  try {
    const data = await Expense.find({ userId: req.user.id });
    res.json(data);

  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;