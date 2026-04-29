import { useEffect, useState } from "react";
import API from "../api/axios";
import "./Book.css";
import { useNavigate } from "react-router-dom";

function Books() {
  const [books, setBooks] = useState([]);
  const [collections, setCollections] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navigate = useNavigate();

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

  const addToShelf = async (collectionId, bookId) => {
    try {
      await API.post("/collections/add-book", {
        collectionId,
        bookId,
      });

      setOpenDropdown(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="library-page">
      <h1 className="library-title">My Library</h1>

      <div className="books-grid">
        {books.map((book) => (
          <div
            key={book.id}
            className="book-card fade-in"
            onClick={() => navigate(`/book/${book.id}`)}
          >
            <div className="book-image-wrapper">
              <img
                src={`http://localhost:5000/${book.image_url}`}
                alt={book.title}
              />
            </div>

            <div className="book-info">
              <h3>{book.title}</h3>

              <p>
                <span className="label">Author:</span>{" "}
                {book.author?.name}
              </p>

              <p>
                <span className="label">Genre:</span>{" "}
                {book.genre?.name}
              </p>

              <span className={`status ${book.status}`}>
                {book.status}
              </span>

              <button
                className="add-btn-book"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(
                    openDropdown === book.id ? null : book.id
                  );
                }}
              >
                + Add to shelf
              </button>

              {openDropdown === book.id && (
                <div className="dropdown">
                  {collections.map((col) => (
                    <div
                      key={col.id}
                      className="option"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToShelf(col.id, book.id);
                      }}
                    >
                       {col.name}
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

export default Books;