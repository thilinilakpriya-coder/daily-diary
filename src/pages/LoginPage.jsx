import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const API_BASE_URL = "http://localhost:5000/api/users";

      // ✅ Send login request to backend
      const res = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      // ✅ Save JWT token and redirect
      localStorage.setItem("token", res.data.token);
      setMessage("✅ Login successful!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage("❌ Invalid credentials or server error.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back 👋</h2>
      <form onSubmit={handleLogin}>
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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {message && <p className="message">{message}</p>}

      <p className="link">
        Don’t have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}

export default LoginPage;
