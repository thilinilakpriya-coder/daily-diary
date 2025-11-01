import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Directly call your backend API
      const API_BASE_URL = "http://localhost:5000/api";

      // 1️⃣ Register user
      await axios.post(`${API_BASE_URL}/users/register`, {
        name,
        email,
        password,
      });

      // 2️⃣ Auto login after successful register
      const res = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password,
      });

      // 3️⃣ Save token and redirect
      localStorage.setItem("token", res.data.token);
      setMessage("✅ Registration successful!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error("Registration error:", err);
      setMessage("❌ Registration failed. Email may already be registered.");
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      <form onSubmit={handleRegister}>
        <label>Name:</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>

      {message && <p className="message">{message}</p>}

      <p className="link">
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
