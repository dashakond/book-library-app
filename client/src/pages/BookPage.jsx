import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import "./BookPage.css";

function BookPage() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [activeSession, setActiveSession] = useState(null);

  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState("");

  const [timer, setTimer] = useState(0);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const safePage = (v) => {
    const n = Number(v);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  // LOAD
  useEffect(() => {
    const load = async () => {
      const [bookRes, sessionRes, reviewRes] = await Promise.all([
        API.get(`/book/${id}`),
        API.get(`/sessions`),
        API.get(`/reviews/book/${id}`)
      ]);

      setBook(bookRes.data);
      setReviews(reviewRes.data);

      const sessions = sessionRes.data
        .filter(s => s.bookId == id)
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

      const active = sessions.find(s => !s.endTime);
      const last = sessions[0];

      if (last?.endPage != null) setStartPage(last.endPage);

      if (active) {
        setActiveSession(active);
        startTimeRef.current = new Date(active.startTime).getTime();

        intervalRef.current = setInterval(() => {
          setTimer(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);
      }
    };

    load();

    return () => clearInterval(intervalRef.current);
  }, [id]);

  const startReading = async () => {
    const res = await API.post("/sessions/start", {
      bookId: id,
      startPage: safePage(startPage),
    });

    setActiveSession(res.data);
    startTimeRef.current = Date.now();
    setTimer(0);

    intervalRef.current = setInterval(() => {
      setTimer(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

  const endReading = async () => {
    const end = safePage(endPage);

    if (end < startPage) return alert("Invalid page");

   await API.post("/sessions/end", { endPage: end });

    await API.post("/book/finish", {
     bookId: id
    });
    
    clearInterval(intervalRef.current);
    setActiveSession(null);
    setTimer(0);
    setEndPage("");

    const updated = await API.get(`/book/${id}`);
    setBook(updated.data);
    setStartPage(end);
  };

  const submitReview = async () => {
    try {
      await API.post("/reviews", {
        bookId: Number(id),
        rating: Number(rating),
        comment
      });

      const res = await API.get(`/reviews/book/${id}`);
      setReviews(res.data);

      setComment("");
      setRating(5);
      setShowReviewForm(false);

    } catch (err) {
      console.error(err);
      alert("Error submitting review");
    }
  };

  if (!book) return <div className="loading">Loading...</div>;

  const progress = book.pages
    ? Math.min(((safePage(endPage || startPage)) / book.pages) * 100, 100)
    : 0;

  const finished = progress >= 100 && !activeSession;

  return (
    <div className="book-layout">

      {/* HERO */}
      <div className="hero">

        <img src={`http://localhost:5000/${book.image_url}`} />

        <div className="hero-info">

          <h1>{book.title}</h1>

          <p className="meta">
            {book.author?.name} • {book.genre?.name}
          </p>

          <p className="meta">Pages: {book.pages}</p>

          {book.description && (
            <p className="description">
              {book.description}
            </p>
          )}

          <span className="status">{book.status}</span>

        </div>
      </div>

      {/* PROGRESS */}
      <div className="card">
        <h3>Progress</h3>

        <div className="bar">
          <div style={{ width: `${progress}%` }} />
        </div>

        <p className="percent">{Math.round(progress)}%</p>
      </div>

      {/* SESSION */}
      <div className="card">
        <h3>Session</h3>

        {!activeSession ? (
          <>
            <input
              value={startPage}
              onChange={e => setStartPage(e.target.value)}
              placeholder="Start page"
            />
            <button onClick={startReading}>Start reading</button>
          </>
        ) : (
          <>
            <div className="timer">⏱ {timer}s</div>

            <input
              value={endPage}
              onChange={e => setEndPage(e.target.value)}
              placeholder="End page"
            />

            <button onClick={endReading}>Finish reading</button>
          </>
        )}
      </div>

      {/* REVIEW FORM */}
      {finished && (
        <div className="card">

          <button onClick={() => setShowReviewForm(!showReviewForm)}>
            {showReviewForm ? "Close review" : "Write a review ⭐"}
          </button>

          {showReviewForm && (
            <div className="review-form">

              <h3>Leave review</h3>

              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1,2,3,4,5].map(n => (
                  <option key={n} value={n}>{n} ⭐</option>
                ))}
              </select>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your thoughts..."
              />

              <button onClick={submitReview}>
                Submit review
              </button>

            </div>
          )}

        </div>
      )}

      {/* REVIEWS */}
      <div className="card reviews">

        <h3>Reviews</h3>

        {reviews.length === 0 && <p>No reviews yet</p>}

        {reviews.map(r => (
          <div className="review" key={r.id}>
            <b>{r.user?.name}</b>
            <div className="stars">{"⭐".repeat(r.rating)}</div>
            <p>{r.comment}</p>
          </div>
        ))}

      </div>

    </div>
  );
}

export default BookPage;