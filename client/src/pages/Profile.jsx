import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

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
    <div style={{ padding: 20 }}>
      <h1>👤 Profile</h1>

      <h3>📊 Library Stats</h3>

      <div style={styles.grid}>
        <div style={styles.card}>📚 Total: {total}</div>
        <div style={styles.card}>✅ Finished: {finished}</div>
        <div style={styles.card}>📖 Reading: {reading}</div>
        <div style={styles.card}>📕 Not read: {notRead}</div>
        <div style={styles.card}>🚫 Abandoned: {abandoned}</div>
      </div>

      <h3>🎭 Genres</h3>
      {Object.entries(genreStats).map(([genre, count]) => (
        <p key={genre}>
          {genre}: {count}
        </p>
      ))}

      <h3>✍️ Authors</h3>
      {Object.entries(authorStats).map(([author, count]) => (
        <p key={author}>
          {author}: {count}
        </p>
      ))}

      <button onClick={handleLogout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 10,
    marginBottom: 20
  },

  card: {
    padding: 15,
    border: "1px solid #ddd",
    borderRadius: 10,
    background: "#f9f9f9"
  },

  logout: {
    marginTop: 20,
    padding: 10,
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};

export default Profile;