import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/user/auth");
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  // 🔥 LOGOUT ФУНКЦІЯ
  const handleLogout = () => {
    localStorage.removeItem("token"); // ❌ видаляємо токен
    navigate("/login");               // 🔁 перекидаємо на login
  };

  if (!user) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>Profile</h1>

      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>

      {/* 🔴 кнопка виходу */}
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Profile;