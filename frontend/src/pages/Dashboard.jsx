import { useState } from "react";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");

  const addItem = () => {
    if (!title) return;
    setItems([...items, { id: Date.now(), title }]);
    setTitle("");
  };

  return (
    <div className="container">
      <div className="box">
        <h2>Dashboard</h2>

        <input
          placeholder="Item Name"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <button onClick={addItem}>Add Item</button>

        <hr />

        <h3 className="items-title">Your Items</h3>

{items.length === 0 ? (
  <p className="no-items">No items yet</p>
) : (
  items.map(item => (
    <div key={item.id}>{item.title}</div>
  ))
)}

<button className="logout-btn">Logout</button>
      </div>
    </div>
  );
}