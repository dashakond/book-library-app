import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import "./CollectionPage.css";

function CollectionPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);

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

  const handleRemoveBook = async (bookId) => {
    try {
      await API.delete(`/collections/${id}/books/${bookId}`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  if (!collection) return <p className="loading">Loading...</p>;

  return (
    <div className="collection-page">
      <div className="collection-header">
        <h1>{collection.name}</h1>
        <span>{collection.books?.length || 0} books</span>
      </div>

      <h3 className="section-title">Books</h3>

      {collection.books?.length === 0 ? (
        <div className="empty-state">
          📚 No books yet
        </div>
      ) : (
        <div className="books-list">
          {collection.books.map((book) => (
            <div key={book.id} className="book-item">
  
  <div className="book-left">
    <img
      src={`http://localhost:5000/${book.image_url}`}
      alt={book.title}
      className="book-cover"
    />

    <div className="book-info">
      <h4>{book.title}</h4>

      <span className={`status ${book.status}`}>
        {book.status?.replace("_", " ")}
      </span>
    </div>
  </div>

  <button
    onClick={() => handleRemoveBook(book.id)}
    className="remove-btn"
  >
    Remove
  </button>
</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CollectionPage;