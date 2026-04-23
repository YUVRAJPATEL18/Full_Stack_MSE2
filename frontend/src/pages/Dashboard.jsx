import { useState } from "react";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Lost");
  const [location, setLocation] = useState("");

  const addItem = () => {
    if (!title) return;

    setItems([...items, { id: Date.now(), title }]);
    setTitle("");
    setLocation("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
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

        <select value={type} onChange={(e)=>setType(e.target.value)}>
          <option>Lost</option>
          <option>Found</option>
        </select>

        <input
          placeholder="Location"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
        />

        <button onClick={addItem}>Add Item</button>

        <hr style={{margin: "15px 0"}} />

        <h3>Your Items</h3>

        {items.length === 0 ? (
          <p className="no-items">No items yet</p>
        ) : (
          items.map(item => (
            <div key={item.id}>{item.title}</div>
          ))
        )}

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>
    </div>
  );
}