import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const BASE_URL = "https://backend-gtzb.onrender.com/kino";

function App() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({ title: "", director: "", year: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteHoverId, setDeleteHoverId] = useState(null);
  const [submitHover, setSubmitHover] = useState(false);
  const [inputFocus, setInputFocus] = useState({});

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL);
      setMovies(res.data);
      setError("");
    } catch {
      setError("Kinolarni olishda muammo yuz berdi.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Iltimos, kinoning nomini kiriting.");
      return;
    }
    try {
      await axios.post(BASE_URL, {
        title: form.title.trim(),
        director: form.director.trim() || null,
        year: form.year ? parseInt(form.year) : null,
      });
      setForm({ title: "", director: "", year: "" });
      setError("");
      fetchMovies();
    } catch {
      setError("Kino qo‘shishda xatolik yuz berdi.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setError("");
      fetchMovies();
    } catch {
      setError("Kino o‘chirishda xatolik yuz berdi.");
    }
  };

  return (
    <div className="container">
      <h1 className="header">Kino </h1>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p className="loading">Yuklanmoqda...</p>
      ) : movies.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          Hozircha kinolar mavjud emas.
        </p>
      ) : (
        <ul className="movie-list">
          {movies.map(({ id, title, director, year }) => (
            <li key={id} className="movie-item">
              <div className="movie-info">
                <strong>{title}</strong> — {director || "Rejissor noma'lum"},{" "}
                {year || "Yil noma'lum"}
              </div>
              <button
                className={`delete-btn ${
                  deleteHoverId === id ? "delete-btn-hover" : ""
                }`}
                onClick={() => handleDelete(id)}
                onMouseEnter={() => setDeleteHoverId(id)}
                onMouseLeave={() => setDeleteHoverId(null)}
                aria-label={`Delete movie ${title}`}
              >
                O'chirish
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <h2>Yangi kino qo‘shish</h2>

        <div className="form-group">
          <label htmlFor="title" className="label">
            Kino nomi (majburiy)
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            onFocus={() => setInputFocus({ ...inputFocus, title: true })}
            onBlur={() => setInputFocus({ ...inputFocus, title: false })}
            className={`input ${inputFocus.title ? "input-focus" : ""}`}
            required
            placeholder="Masalan: Inception"
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="director" className="label">
            Rejissor
          </label>
          <input
            id="director"
            name="director"
            type="text"
            value={form.director}
            onChange={handleChange}
            onFocus={() => setInputFocus({ ...inputFocus, director: true })}
            onBlur={() => setInputFocus({ ...inputFocus, director: false })}
            className={`input ${inputFocus.director ? "input-focus" : ""}`}
            placeholder="Masalan: Christopher Nolan"
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="year" className="label">
            Chiqarilgan yil
          </label>
          <input
            id="year"
            name="year"
            type="number"
            min="1800"
            max="2102"
            value={form.year}
            onChange={handleChange}
            onFocus={() => setInputFocus({ ...inputFocus, year: true })}
            onBlur={() => setInputFocus({ ...inputFocus, year: false })}
            className={`input ${inputFocus.year ? "input-focus" : ""}`}
            placeholder="Masalan: 2010"
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          className={`submit-btn ${submitHover ? "submit-btn-hover" : ""}`}
          onMouseEnter={() => setSubmitHover(true)}
          onMouseLeave={() => setSubmitHover(false)}
        >
          Qo‘shish
        </button>
      </form>
    </div>
  );
}

export default App;