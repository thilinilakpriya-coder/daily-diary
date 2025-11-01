import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashboardPage.css";

function DashboardPage() {
  const [diaries, setDiaries] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:5000/api/diary";

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchDiaries();
    }
  }, [token, navigate]);

  // ✅ Fetch all diaries
  const fetchDiaries = async () => {
    try {
      const res = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiaries(res.data || []);
    } catch (error) {
      console.error("Error fetching diaries:", error);
    }
  };

  // ✅ Add or Update diary entry
  const handleAddOrUpdateDiary = async (e) => {
    e.preventDefault();

    const diaryData = {
      title,
      description,
      mood,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
    };

    try {
      if (editingId) {
        // Update existing diary
        await axios.put(`${API_BASE_URL}/${editingId}`, diaryData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Add new diary
        await axios.post(API_BASE_URL, diaryData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Refresh list and clear form
      fetchDiaries();
      resetForm();
    } catch (error) {
      console.error("Error saving diary:", error);
    }
  };

  // ✅ Delete diary entry
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchDiaries();
      } catch (error) {
        console.error("Error deleting diary:", error);
      }
    }
  };

  // ✅ Edit diary entry
  const handleEdit = (id) => {
    const diaryToEdit = diaries.find((item) => item._id === id);
    if (diaryToEdit) {
      setTitle(diaryToEdit.title);
      setDescription(diaryToEdit.description);
      setMood(diaryToEdit.mood);
      setDate(new Date(diaryToEdit.date).toISOString().split("T")[0]);
      setEditingId(id);
    }
  };

  // ✅ Clear form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMood("");
    setDate("");
    setEditingId(null);
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <header>
        <h2>My Daily Diary</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <section className="add-diary">
        <h3>{editingId ? "Edit Diary Entry" : "Add Today’s Details"}</h3>
        <form onSubmit={handleAddOrUpdateDiary}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            required
          >
            <option value="">Select Mood</option>
            <option value="Happy">😊 Happy</option>
            <option value="Sad">😢 Sad</option>
            <option value="Excited">🤩 Excited</option>
            <option value="Tired">😴 Tired</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div className="button-group">
            <button type="submit">
              {editingId ? "Update Entry" : "Save Entry"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="diary-list">
        <h3>My Entries</h3>
        {diaries.length === 0 ? (
          <p>No diary entries yet.</p>
        ) : (
          diaries.map((item) => (
            <div key={item._id} className="diary-item">
              <div className="diary-info">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <p className="mood">Mood: {item.mood}</p>
                <p className="date">
                  📅 {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
              <div className="action-buttons">
                <button className="edit-btn" onClick={() => handleEdit(item._id)}>
                  ✏️
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item._id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
