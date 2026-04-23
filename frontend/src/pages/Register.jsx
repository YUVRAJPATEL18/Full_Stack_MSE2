import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      if (!name || !email || !password) {
        alert("All fields required");
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

      alert(res.data.message);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <input
        className="input"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="input"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="input"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn" onClick={handleRegister}>
        Register
      </button>

      <p onClick={() => (window.location.href = "/")}>
        Already have account? Login
      </p>
    </div>
  );
}