import { useEffect, useState } from "react";
import API from "../api/axios";
import "./Library.css";
import { useNavigate } from "react-router-dom";

function Books() {
  const [books, setBooks] = useState([]);
  const [collections, setCollections] = useState([]);

  const [openDropdown, setOpenDropdown] = useState(null); // 👈 яка книга відкрита

  const navigate = useNavigate();

  // 📌 load data
  useEffect(() => {
    const fetchBooks = async () => {
      const res = await API.get("/book");
      setBooks(res.data);
    };

    const fetchCollections = async () => {
      const res = await API.get("/collections");
      setCollections(res.data);
    };

    fetchBooks();
    fetchCollections();
  }, []);

  // ➕ add book
  const addToShelf = async (collectionId, bookId) => {
    try {
      await API.post("/collections/add-book", {
        collectionId,
        bookId,
      });

      alert("Book added to collection!");
      setOpenDropdown(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="library-page">
      <h1>My Library</h1>

      <div className="books-grid">
        {books.map((book) => (
          <div
            key={book.id}
            className="book-card"
            onClick={() => navigate(`/book/${book.id}`)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={`http://localhost:5000/${book.image_url}`}
              alt={book.title}
            />

            <div className="book-info">
              <h3>{book.title}</h3>

              <p>
                <b>Author:</b> {book.author?.name}
              </p>

              <p>
                <b>Genre:</b> {book.genre?.name}
              </p>

              <span className={`status ${book.status}`}>
                {book.status}
              </span>

              {/* ⭐ BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(
                    openDropdown === book.id ? null : book.id
                  );
                }}
                style={styles.btn}
              >
                Add to shelf
              </button>

              {/* 📌 DROPDOWN */}
              {openDropdown === book.id && (
                <div style={styles.dropdown}>
                  {collections.map((col) => (
                    <div
                      key={col.id}
                      style={styles.option}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToShelf(col.id, book.id);
                      }}
                    >
                      📚 {col.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  btn: {
    marginTop: 10,
    padding: "6px 10px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: 6,
  },

  dropdown: {
    marginTop: 8,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 6,
    position: "absolute",
    zIndex: 10,
    width: 150,
  },

  option: {
    padding: 8,
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },
};

export default Books;