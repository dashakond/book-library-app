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

  // 🔥 SAFE NUMBER (без мінусів)
  const safePage = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 0) return 0;
    return num;
  };

  // 📌 LOAD BOOK + LAST SESSION
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, sessionRes] = await Promise.all([
          API.get(`/book/${id}`),
          API.get(`/sessions`)
        ]);

        setBook(bookRes.data);

        // 🔥 беремо останню сесію цієї книги
        const last = sessionRes.data
          .filter(s => s.bookId == id)
          .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))[0];

        if (last?.endPage != null) {
          setStartPage(last.endPage); // 💡 продовження читання
        }

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [id]);

  // ▶ START
  const startReading = async () => {
    try {
      const res = await API.post("/sessions/start", {
        bookId: id,
        startPage: safePage(startPage),
      });

      setSession(res.data);

      setTimer(0);
      startTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        setTimer(
          Math.floor((Date.now() - startTimeRef.current) / 1000)
        );
      }, 1000);

    } catch (err) {
      console.log(err);
    }
  };

  // ⏹ END
  const endReading = async () => {
    try {
      const end = safePage(endPage);

      // 🔥 ВАЛІДАЦІЯ
      if (end < startPage) {
        return alert("End page cannot be less than start page");
      }

      await API.post("/sessions/end", {
        endPage: end,
      });

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      setTimer(0);
      setSession(null);
      setEndPage("");

      const updated = await API.get(`/book/${id}`);
      setBook(updated.data);

      // 🔥 новий старт = остання сторінка
      setStartPage(end);

    } catch (err) {
      console.log(err);
    }
  };

  if (!book) return <p>Loading...</p>;

  // 📊 ПРОГРЕС (розумний)
  const currentPage = safePage(endPage || startPage);

  const progress =
    book.pages
      ? Math.min((currentPage / book.pages) * 100, 100)
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

      {/* 📖 SESSION */}
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
              min="0"
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
              min={startPage}
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