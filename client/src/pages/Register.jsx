import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
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
      const res = await register(form);
      localStorage.setItem("token", res.data.token);
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            name="name"
            placeholder="Name"
            onChange={handleChange}
          />

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

          <button className="auth-btn">Create account</button>
        </form>

        <div className="auth-link">
          Вже є акаунт? <Link to="/login">Увійти</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;