import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await API.get("/user/auth");
        setUser(userRes.data);

        const booksRes = await API.get("/book");
        setBooks(booksRes.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <h2>Loading...</h2>;

  // 📊 STATS
  const total = books.length;
  const finished = books.filter(b => b.status === "finished").length;
  const reading = books.filter(b => b.status === "reading").length;
  const notRead = books.filter(b => b.status === "not_read").length;
  const abandoned = books.filter(b => b.status === "abandoned").length;

  // 🎭 GENRES STATS
  const genreStats = books.reduce((acc, book) => {
    const g = book.genre?.name || "Unknown";
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  // ✍️ AUTHORS STATS
  const authorStats = books.reduce((acc, book) => {
    const a = book.author?.name || "Unknown";
    acc[a] = (acc[a] || 0) + 1;
    return acc;
  }, {});

  return (
  <div className="profile-page">

    <h1 className="profile-title">Profile</h1>

    <h3 className="section-title"> Library Stats</h3>

    <div className="stats-grid">
      <div className="stat-card">📚 Total: {total}</div>
      <div className="stat-card">✅ Finished: {finished}</div>
      <div className="stat-card">📖 Reading: {reading}</div>
      <div className="stat-card">📕 Not read: {notRead}</div>
      <div className="stat-card">🚫 Abandoned: {abandoned}</div>
    </div>
<div className="progress-section">

  <h3>Reading Progress</h3>

  <div className="circle-wrapper">
    <svg className="progress-ring" width="140" height="140">
      <circle
        className="progress-bg"
        cx="70"
        cy="70"
        r="60"
      />
      <circle
        className="progress-bar"
        cx="70"
        cy="70"
        r="60"
        style={{
          strokeDasharray: 377,
          strokeDashoffset: 377 - (377 * finished / total || 0)
        }}
      />
    </svg>

    <div className="circle-text">
      {Math.round((finished / total) * 100) || 0}%
    </div>
  </div>

</div>
   <h3 className="section-title">🎭 Genres</h3>

<div className="bar-list">
  {Object.entries(genreStats).map(([genre, count]) => {
    const percent = (count / total) * 100;

    return (
      <div key={genre} className="bar-item">
        <div className="bar-label">
          {genre} ({count})
        </div>

        <div className="bar-bg">
          <div
            className="bar-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  })}
</div>

    <h3 className="section-title">✍️ Authors</h3>

    <div className="list-block">
      {Object.entries(authorStats).map(([author, count]) => (
        <div key={author} className="list-item">
          <span>{author}</span>
          <span>{count}</span>
        </div>
      ))}
    </div>

    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>

  </div>
);
}



export default Profile;