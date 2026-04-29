import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Collections.css";

function Collections() {
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchCollections = async () => {
    try {
      const res = await API.get("/collections");
      setCollections(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      await API.post("/collections", { name });
      setName("");
      fetchCollections();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    try {
      await API.delete(`/collections/${id}`);
      fetchCollections();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="collections-page">
      <h1>My Collections </h1>

      {/* CREATE */}
      <div className="create-box">
        <input
          placeholder="Enter collection name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={handleCreate}>
          + Create
        </button>
      </div>

      {/* LIST */}
      {collections.length === 0 ? (
        <div className="empty-state">
          📚 No collections yet
        </div>
      ) : (
        <div className="collections-grid">
          {collections.map((col) => (
            <div
              key={col.id}
              className="collection-card"
              onClick={() => navigate(`/collections/${col.id}`)}
            >
              <div className="card-top">
                <h3>{col.name}</h3>
                <span>{col.books?.length || 0} books</span>
              </div>

              <button
                onClick={(e) => handleDelete(col.id, e)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Collections;