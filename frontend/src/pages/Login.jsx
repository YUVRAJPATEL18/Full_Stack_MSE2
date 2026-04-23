import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://full-stack-mse2.onrender.com/api/login", // ✅ correct route
        {
          email,
          password
        }
      );

      localStorage.setItem("token", res.data.token);
      alert("Login successful");
      window.location.href = "/dashboard";

    } catch (err) {
      console.log(err.response);
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
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p className="link" onClick={()=>window.location.href="/register"}>
          Don't have account? Register
        </p>
      </div>
    </div>
  );
}