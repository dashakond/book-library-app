import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Collections() {
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // 📌 load collections
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

  // ➕ create collection
  const handleCreate = async () => {
    if (!name) return;

    try {
      await API.post("/collections", { name });

      setName("");
      fetchCollections();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>My Collections 📚</h1>

      {/* CREATE COLLECTION */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Collection name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={handleCreate} style={{ marginLeft: 10 }}>
          Create
        </button>
      </div>

      {/* LIST */}
      <div>
        {collections.map((col) => (
          <div
            key={col.id}
            style={styles.card}
            onClick={() => navigate(`/collections/${col.id}`)}
          >
            <h3>{col.name}</h3>

            <p>
              📚 {col.books?.length || 0} books
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: 15,
    marginBottom: 10,
    border: "1px solid #ddd",
    borderRadius: 8,
    cursor: "pointer",
    background: "#fff"
  }
};

export default Collections;