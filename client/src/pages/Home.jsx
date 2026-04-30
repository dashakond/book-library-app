import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* 🌟 HERO */}
      <div className="home-card">

        <div className="badge">📚 Personal Reading Tracker</div>

        <h1>
          Build your <span>reading habit</span> and never lose track of books again
        </h1>

        <p className="subtitle">
          My Library helps you organize books, track reading progress,
          create collections, set goals and build a powerful reading routine.
        </p>

        {/* 📊 STATS */}
        <div className="stats">
          <div>
            <h3>📖</h3>
            <p>Track books</p>
          </div>

          <div>
            <h3>🎯</h3>
            <p>Reading goals</p>
          </div>

          <div>
            <h3>📚</h3>
            <p>Collections</p>
          </div>
        </div>

        {/* ✨ FEATURES */}
        <div className="features">
          <div>✔ Save books you want to read</div>
          <div>✔ Track reading sessions</div>
          <div>✔ Organize collections</div>
          <div>✔ Monitor progress & status</div>
        </div>

        {/* 🚀 CTA */}
        <div className="buttons">
          <button onClick={() => navigate("/login")}>
            Login
          </button>

          <button
            className="secondary"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>

        <p className="footer-text">
          Start building your reading journey today 📖
        </p>

      </div>

    </div>
  );
}

export default Home;