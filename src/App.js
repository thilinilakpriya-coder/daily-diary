import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";       // ✅ LoginPage.jsx
import RegisterPage from "./pages/RegisterPage"; // ✅ RegisterPage.jsx
import DashboardPage from "./pages/DashboardPage"; // ✅ DashboardPage.jsx
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} /> {/* ✅ */}
      </Routes>
    </Router>
  );
}

export default App;
