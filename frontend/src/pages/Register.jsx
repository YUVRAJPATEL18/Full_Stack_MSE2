import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          name,
          email,
          password
        }
      );

      alert(res.data.message);

      // redirect to login
      window.location.href = "/";

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container">
      <div className="box">
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
          onClick={() => (window.location.href = "/")}
          style={{ color: "white", cursor: "pointer" }}
        >
          Already have account? Login
        </p>
      </div>
    </div>
  );
}