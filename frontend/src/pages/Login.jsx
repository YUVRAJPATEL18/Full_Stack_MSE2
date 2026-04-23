import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = import.meta.env.VITE_API_URL;

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      alert("Login successful");
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.msg || "Invalid credentials");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

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

      <button onClick={handleLogin}>Login</button>

      <p onClick={() => (window.location.href = "/register")}>
        Don’t have an account? Register
      </p>
    </div>
  );
}