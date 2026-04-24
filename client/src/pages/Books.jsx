import { useEffect, useState } from "react";
import API from "../api/axios";
import "./Library.css";
import { useNavigate } from "react-router-dom";

function Books() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API.get("/book");
        setBooks(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBooks();
  }, []);

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
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;