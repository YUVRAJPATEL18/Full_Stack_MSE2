import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // 🔹 Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API}/api/expenses`, {
        headers: { Authorization: token },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Add expense
  const addExpense = async () => {
    try {
      if (!title || !amount || !category) {
        alert("Fill all fields");
        return;
      }

      await axios.post(
        `${API}/api/expense`,
        { title, amount, category },
        {
          headers: { Authorization: token },
        }
      );

      alert("Expense added");

      setTitle("");
      setAmount("");
      setCategory("");

      fetchExpenses(); // refresh list
    } catch (err) {
      alert("Error adding expense");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    } else {
      fetchExpenses();
    }
  }, []);

  return (
    <div className="container">
      <h2>Expense Dashboard</h2>

      {/* Add Expense */}
      <div>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          placeholder="Category (Food, Travel...)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button onClick={addExpense}>Add Expense</button>
      </div>

      <hr />

      {/* Expense List */}
      <h3>Your Expenses</h3>

      {expenses.length === 0 ? (
        <p>No expenses yet</p>
      ) : (
        expenses.map((exp) => (
          <div key={exp._id} style={{ marginBottom: "10px" }}>
            <b>{exp.title}</b> - ₹{exp.amount} ({exp.category})
          </div>
        ))
      )}

      <br />

      <button onClick={logout}>Logout</button>
    </div>
  );
}