import { useState } from "react";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "Lost",
    location: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addItem = () => {
    if (!form.name) return;

    setItems([...items, { ...form, id: Date.now() }]);

    setForm({
      name: "",
      type: "Lost",
      location: ""
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="container">
      <div className="box">
        <h2>Dashboard</h2>

        {/* FORM */}
        <input
          name="name"
          placeholder="Item Name"
          value={form.name}
          onChange={handleChange}
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option>Lost</option>
          <option>Found</option>
        </select>

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <button onClick={addItem}>Add Item</button>

        <hr />

        {/* ITEMS */}
        <h3>Your Items</h3>

        {items.length === 0 ? (
          <p className="no-items">No items yet</p>
        ) : (
          items.map(item => (
            <div className="item-card" key={item.id}>
              <h4>{item.name}</h4>
              <p><b>Type:</b> {item.type}</p>
              <p><b>Location:</b> {item.location}</p>
            </div>
          ))
        )}

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}