import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button className="auth-btn">Login</button>
        </form>

        <div className="auth-link">
          Немає акаунту? <Link to="/register">Зареєструватись</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;