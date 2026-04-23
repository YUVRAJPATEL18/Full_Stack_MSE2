import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`, // ✅ FIXED HERE
        {
          email,
          password
        }
      );

      localStorage.setItem("token", res.data.token);
      alert("Login Successful");

      window.location.href = "/dashboard";

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container">
      <div className="box">
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

        <p
          onClick={() => (window.location.href = "/register")}
          style={{ color: "white", cursor: "pointer" }}
        >
          Don't have account? Register
        </p>
      </div>
    </div>
  );
}