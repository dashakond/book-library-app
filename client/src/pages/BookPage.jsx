import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function BookPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(`/book/${id}`);
        setBook(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{book.title}</h1>

      <img
        src={`http://localhost:5000/${book.image_url}`}
        alt={book.title}
        style={{ width: "200px" }}
      />

      <p><b>Author:</b> {book.author?.name}</p>
      <p><b>Genre:</b> {book.genre?.name}</p>
      <p>{book.description}</p>
    </div>
  );
}

export default BookPage;