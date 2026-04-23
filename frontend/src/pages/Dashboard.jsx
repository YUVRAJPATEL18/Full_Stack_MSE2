import { useState } from "react";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");

  const addItem = () => {
    if (!name) return;

    setItems([...items, { id: Date.now(), name }]);
    setName("");
  };

  return (
    <div className="container">
      <div className="box">

        <h2>Dashboard</h2>

        <input
          placeholder="Item Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <button onClick={addItem}>Add Item</button>

        <h3>Your Items</h3>

        {items.length === 0 ? (
          <p className="no-items">No items yet</p>
        ) : (
          items.map(item => (
            <div className="item-card" key={item.id}>
              {item.name}
              <button className="delete-btn">Delete</button>
            </div>
          ))
        )}

        <button>Logout</button>

      </div>
    </div>
  );
