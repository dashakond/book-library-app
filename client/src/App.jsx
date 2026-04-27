import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Books from "./pages/Books"; 
import BookPage from "./pages/BookPage";
import Collections from "./pages/Collections";
import CollectionPage from "./pages/CollectionPage";
import Wishlist from "./pages/Wishlist";
import Goals from "./pages/Goals";
import ReadingSessions from "./pages/ReadingHistory";

import ProtectedLayout from "./layout/ProtectedLayout";

function App() {
  const isAuth = !!localStorage.getItem("token");

  return (
    <Routes>

      {/* 🔓 public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 protected (ВСІ сторінки тут) */}
      <Route element={<ProtectedLayout />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/book" element={<Books />} />
        <Route path="/book/:id" element={<BookPage />} />

        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id" element={<CollectionPage />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/goals" element={<Goals />} />

        <Route path="/sessions" element={<ReadingSessions />} />

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