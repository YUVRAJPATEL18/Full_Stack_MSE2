import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      // basic validation (frontend side)
      if (!name || !email || !password) {
        alert("All fields are required");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          name,
          email,
          password,
        }
      );

      alert(res.data.msg || "Registered successfully");

      // redirect to login
      window.location.href = "/";

    } catch (err) {
      console.error("REGISTER ERROR:", err);

      // show real backend error
      alert(
        err.response?.data?.msg ||
        err.response?.data ||
        "Registration failed"
      );
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

      <p
        style={{ cursor: "pointer", marginTop: "10px" }}
        onClick={() => (window.location.href = "/")}
      >
        Already have an account? Login
      </p>
    </div>
  );
}