import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/expenses`,
      { headers: { Authorization: token } }
    );
    setExpenses(res.data);
  };

  const addExpense = async () => {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/expense`,
      { title, amount, category },
      { headers: { Authorization: token } }
    );
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/expense/${id}`,
      { headers: { Authorization: token } }
    );
    fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <input className="input" placeholder="Title" onChange={(e)=>setTitle(e.target.value)} />
      <input className="input" placeholder="Amount" onChange={(e)=>setAmount(e.target.value)} />
      <input className="input" placeholder="Category" onChange={(e)=>setCategory(e.target.value)} />

      <button className="btn" onClick={addExpense}>Add Expense</button>

      <hr />

      {expenses.length === 0 ? (
        <p>No expenses yet</p>
      ) : (
        expenses.map((e) => (
          <div key={e._id}>
            {e.title} - ₹{e.amount}
            <button onClick={() => deleteExpense(e._id)}>❌</button>
          </div>
        ))
      )}

      <button
        className="btn logout"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
}