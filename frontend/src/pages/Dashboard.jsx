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

        <h2>Lost & Found</h2>

        <div className="form-group">
          <input name="name" placeholder="Item Name" value={form.name} onChange={handleChange} />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />

          <select name="type" value={form.type} onChange={handleChange}>
            <option>Lost</option>
            <option>Found</option>
          </select>

          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          <input name="contact" placeholder="Contact Info" value={form.contact} onChange={handleChange} />
        </div>

        <button className="primary-btn" onClick={addItem}>Add Item</button>

        <hr />

        <h3>Your Items</h3>

        {items.length === 0 ? (
          <p className="no-items">No items yet</p>
        ) : (
          <div className="items-list">
            {items.map(item => (
              <div className="item-card" key={item.id}>
                <h4>{item.name}</h4>
                <p>{item.description}</p>

                <div className="meta">
                  <span>{item.type}</span>
                  <span>{item.location}</span>
                  <span>{item.date}</span>
                </div>

                <p className="contact">📞 {item.contact}</p>

                <button className="delete-btn" onClick={() => deleteItem(item.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="logout-btn">Logout</button>

      </div>
    </div>
  );
}