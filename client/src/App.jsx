import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Books from "./pages/Books"; 
import BookPage from "./pages/BookPage";
import Collections from "./pages/Collections";
import CollectionPage from "./pages/CollectionPage";

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
      <Route path="/book/:id" element={<BookPage />} />
      <Route element={<ProtectedLayout />}>
     <Route path="/collections" element={<Collections />} />
     <Route path="/collections/:id" element={<CollectionPage />} />
     </Route>


    </Routes>
  );
}

export default App;