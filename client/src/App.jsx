import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Books from "./pages/Books"; // 🔥 не забудь імпорт

import ProtectedLayout from "./layout/ProtectedLayout";

function App() {
  const isAuth = !!localStorage.getItem("token");

  return (
    <Routes>

      {/* 🔓 public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 protected */}
      <Route element={<ProtectedLayout />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/book" element={<Books />} />
      </Route>

      {/* redirect */}
      <Route
        path="/"
        element={
          isAuth ? (
            <Navigate to="/profile" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

    </Routes>
  );
}

export default App;