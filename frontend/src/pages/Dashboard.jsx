import { useState } from "react";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "Lost",
    location: "",
    contact: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addItem = () => {
    if (!form.name) return;

    setItems([
      ...items,
      { ...form, id: Date.now(), date: new Date().toLocaleDateString() }
    ]);

    setForm({
      name: "",
      description: "",
      type: "Lost",
      location: "",
      contact: ""
    });
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="container">
      <div className="box">

        <h2>Lost & Found Dashboard</h2>

        {/* FORM */}
        <input name="name" placeholder="Item Name" value={form.name} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        <select name="type" value={form.type} onChange={handleChange}>
          <option>Lost</option>
          <option>Found</option>
        </select>

        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <input name="contact" placeholder="Contact Info" value={form.contact} onChange={handleChange} />

        <button onClick={addItem}>Add Item</button>

        <hr />

        {/* LIST */}
        <h3>Your Items</h3>

        {items.length === 0 ? (
          <p className="no-items">No items yet</p>
        ) : (
          items.map(item => (
            <div className="item-card" key={item.id}>
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <p><b>Type:</b> {item.type}</p>
              <p><b>Location:</b> {item.location}</p>
              <p><b>Date:</b> {item.date}</p>
              <p><b>Contact:</b> {item.contact}</p>

              <button onClick={() => deleteItem(item.id)}>Delete</button>
            </div>
          ))
        )}

        <button className="logout-btn">Logout</button>

      </div>
    </div>
  );
}