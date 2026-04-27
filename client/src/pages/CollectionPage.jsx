import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function CollectionPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);

  // 📌 load collection
  const fetchData = async () => {
    try {
      const res = await API.get("/collections");
      const found = res.data.find((c) => c.id == id);
      setCollection(found);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // ❌ remove book from collection
  const handleRemoveBook = async (bookId) => {
    try {
      await API.delete(`/collections/${id}/books/${bookId}`);

      // refresh UI
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  if (!collection) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{collection.name}</h1>

      <h3>Books:</h3>

      {collection.books?.length === 0 && <p>No books yet</p>}

      {collection.books?.map((book) => (
        <div key={book.id} style={styles.bookItem}>
          <span>📖 {book.title}</span>

          {/* ❌ remove button */}
          <button
            onClick={() => handleRemoveBook(book.id)}
            style={styles.deleteBtn}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  bookItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    border: "1px solid #ddd",
    borderRadius: 8
  },

  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: 5,
    cursor: "pointer"
  }
};

export default CollectionPage;