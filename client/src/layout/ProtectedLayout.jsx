import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function ProtectedLayout() {
  const token = localStorage.getItem("token");

  // ❌ якщо не авторизований
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {/* 🔝 меню */}
      <Navbar />

      {/* 📄 сторінки всередині */}
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default ProtectedLayout;