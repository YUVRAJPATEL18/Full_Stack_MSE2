import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Login first");
      window.location.href = "/";
      return;
    }
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/expenses`,
        {
          headers: { Authorization: token },
        }
      );

      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addExpense = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/expenses`,
        { title, amount, category },
        {
          headers: { Authorization: token },
        }
      );

      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <button onClick={logout}>Logout</button>

      <h3>Add Expense</h3>

      <input
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="Category"
        onChange={(e) => setCategory(e.target.value)}
      />

      <button onClick={addExpense}>Add</button>

      <h3>Total: ₹{total}</h3>

      <h3>Your Expenses</h3>

      {expenses.map((e) => (
        <p key={e._id}>
          {e.title} - ₹{e.amount} ({e.category})
        </p>
      ))}
    </div>
  );
}