import { useEffect, useState } from "react";
import API from "../api/axios";
import "./Book.css";
import { useNavigate } from "react-router-dom";

function Books() {
  const [books, setBooks] = useState([]);
  const [collections, setCollections] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [image, setImage] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    pages: "",
    description: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchCollections();
  }, []);

  const fetchBooks = async () => {
    const res = await API.get("/book");
    setBooks(res.data);
  };

  const fetchCollections = async () => {
    const res = await API.get("/collections");
    setCollections(res.data);
  };

  const createBook = async () => {
    try {
      const formData = new FormData();

      formData.append("title", newBook.title);
      formData.append("authorName", newBook.author);
      formData.append("genreName", newBook.genre);
      formData.append("pages", newBook.pages);
      formData.append("description", newBook.description);

      if (image) formData.append("image", image);

      await API.post("/book", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setShowForm(false);
      setImage(null);

      setNewBook({
        title: "",
        author: "",
        genre: "",
        pages: "",
        description: ""
      });

      fetchBooks();
    } catch (err) {
      console.log(err);
    }
  };

  const addToShelf = async (collectionId, bookId) => {
    try {
      await API.post("/collections/add-book", {
        collectionId,
        bookId
      });

      setOpenDropdown(null);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔎 FILTER LOGIC
  const filteredBooks = books.filter((book) => {
    const matchSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author?.name?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all" || book.status === statusFilter;

    const matchGenre =
      genreFilter === "all" || book.genre?.name === genreFilter;

    const matchAuthor =
      authorFilter === "all" || book.author?.name === authorFilter;

    return matchSearch && matchStatus && matchGenre && matchAuthor;
  });

  // unique values for filters
  const authors = [...new Set(books.map(b => b.author?.name).filter(Boolean))];
  const genres = [...new Set(books.map(b => b.genre?.name).filter(Boolean))];

  return (
    <div className="library-page">

      {/* HEADER */}
      <div className="library-header">
        <h1>My Library</h1>

        <button
          className="add-book-btn"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Book
        </button>
      </div>

      {/* 🔎 SEARCH + FILTERS */}
      {/* 🔎 SEARCH + FILTERS */}
<div className="filters">

  <input
    placeholder="Search by title or author..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="search-input"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="all">All status</option>
    <option value="reading">Reading</option>
    <option value="finished">Finished</option>
    <option value="not_read">Not read</option>
    <option value="abandoned">Abandoned</option>
  </select>

  <select
    value={genreFilter}
    onChange={(e) => setGenreFilter(e.target.value)}
  >
    <option value="all">All genres</option>
    {genres.map((g) => (
      <option key={g} value={g}>{g}</option>
    ))}
  </select>

  <select
    value={authorFilter}
    onChange={(e) => setAuthorFilter(e.target.value)}
  >
    <option value="all">All authors</option>
    {authors.map((a) => (
      <option key={a} value={a}>{a}</option>
    ))}
  </select>

  {/* 🔥 RESET BUTTON */}
  <button
    className="reset-btn"
    onClick={() => {
      setSearch("");
      setStatusFilter("all");
      setGenreFilter("all");
      setAuthorFilter("all");
    }}
  >
    Reset
  </button>

</div>

      {/* FORM */}
      {showForm && (
        <div className="add-book-form">

          <input
            placeholder="Title"
            value={newBook.title}
            onChange={(e) =>
              setNewBook({ ...newBook, title: e.target.value })
            }
          />

          <input
            placeholder="Author"
            value={newBook.author}
            onChange={(e) =>
              setNewBook({ ...newBook, author: e.target.value })
            }
          />

          <input
            placeholder="Genre"
            value={newBook.genre}
            onChange={(e) =>
              setNewBook({ ...newBook, genre: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Pages"
            value={newBook.pages}
            onChange={(e) =>
              setNewBook({ ...newBook, pages: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            value={newBook.description}
            onChange={(e) =>
              setNewBook({ ...newBook, description: e.target.value })
            }
          />

         <div className="file-upload">
  
  <label className="file-btn">
    📁 Upload cover image

    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => setImage(e.target.files[0])}
    />
  </label>

  {image && (
    <div className="file-name">
      {image.name}
    </div>
  )}

</div>

          <div className="form-actions">
            <button onClick={createBook} className="save-btn">Save</button>
            <button onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
          </div>

        </div>
      )}

      {/* BOOKS */}
      <div className="books-grid">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="book-card"
            onClick={() => navigate(`/book/${book.id}`)}
          >
            <img src={`http://localhost:5000/${book.image_url}`} />

            <div className="book-info">
              <h3>{book.title}</h3>

              <p><b>Author:</b> {book.author?.name}</p>
              <p><b>Genre:</b> {book.genre?.name}</p>

              <span className={`status ${book.status}`}>
  {book.status.replace("_", " ")}
</span>

              <button
                className="add-btn-book"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === book.id ? null : book.id);
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