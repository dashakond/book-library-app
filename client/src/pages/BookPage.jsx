import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function BookPage() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [session, setSession] = useState(null);

  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState("");

  const [timer, setTimer] = useState(0);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // 📌 LOAD BOOK
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(`/book/${id}`);
        setBook(res.data);
      } catch (err) {
        console.log("LOAD BOOK ERROR:", err);
      }
    };

    fetchBook();

    // cleanup timer if leave page
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [id]);

  // ▶ START READING
  const startReading = async () => {
    try {
      console.log("START CLICK");
  
      const res = await API.post("/sessions/start", {
        bookId: id,
        startPage: Number(startPage),
      });
  
      console.log("SESSION:", res.data);
  
      setSession(res.data);
  
      setTimer(0);
  
      startTimeRef.current = Date.now();
  
      intervalRef.current = setInterval(() => {
        setTimer(
          Math.floor((Date.now() - startTimeRef.current) / 1000)
        );
      }, 1000);
  
    } catch (err) {
      console.log("START ERROR:", err.response?.data || err.message);
    }
  };

  // ⏹ END READING
  const endReading = async () => {
    try {
      await API.post("/sessions/end", {
        endPage: Number(endPage),
      });

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = null;

      setTimer(0);
      setSession(null);
      setEndPage("");

      const updated = await API.get(`/book/${id}`);
      setBook(updated.data);

    } catch (err) {
      console.log("END ERROR:", err.response?.data || err.message);
    }
  };

  if (!book) return <p>Loading...</p>;

  const progress =
    book.pages && endPage
      ? Math.min((endPage / book.pages) * 100, 100)
      : 0;

  return (
    <div style={{ padding: 20 }}>
      <h1>
        {book.title} <span>({book.status})</span>
      </h1>

      <img
        src={`http://localhost:5000/${book.image_url}`}
        alt={book.title}
        style={{ width: 200 }}
      />

      <p><b>Author:</b> {book.author?.name}</p>
      <p><b>Genre:</b> {book.genre?.name}</p>
      <p><b>Pages:</b> {book.pages}</p>
      <p>{book.description}</p>

      {/* 📊 PROGRESS */}
      <div style={{ marginTop: 20 }}>
        <p>Progress: {Math.round(progress)}%</p>

        <div style={{
          width: "100%",
          height: 10,
          background: "#eee",
          borderRadius: 5
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "green",
            borderRadius: 5
          }} />
        </div>
      </div>

      {/* 📖 READING PANEL */}
      <div style={{
        marginTop: 20,
        padding: 15,
        border: "1px solid #ddd",
        borderRadius: 10
      }}>
        <h3>Reading session</h3>

        {!session ? (
          <>
            <input
              type="number"
              value={startPage}
              onChange={(e) => setStartPage(e.target.value)}
              placeholder="Start page"
            />

            <button onClick={startReading}>
              ▶ Start reading
            </button>
          </>
        ) : (
          <>
            <p>⏱ Time: {timer} sec</p>

            <input
              type="number"
              value={endPage}
              onChange={(e) => setEndPage(e.target.value)}
              placeholder="End page"
            />

            <button onClick={endReading}>
              ⏹ Finish reading
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default BookPage;