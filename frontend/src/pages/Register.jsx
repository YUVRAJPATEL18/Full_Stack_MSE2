import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = import.meta.env.VITE_API_URL;

  const handleRegister = async () => {
    try {
      if (!name || !email || !password) {
        alert("All fields are required");
        return;
      }

      await axios.post(`${API}/api/auth/register`, {
        name,
        email,
        password,
      });

      alert("User registered successfully");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>

      <p onClick={() => (window.location.href = "/")}>
        Already have an account? Login
      </p>
    </div>
  );
}