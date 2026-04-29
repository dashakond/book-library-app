import { useEffect, useState } from "react";
import API from "../api/axios";
import "./ReadingHistory.css"

function ReadingSessions() {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchSessions = async () => {
    try {
      const res = await API.get("/sessions");
  
      const sorted = res.data.sort((a, b) => {
        return new Date(b.startTime) - new Date(a.startTime);
      });
  
      setSessions(sorted);
  
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(() => {
      fetchSessions();
    }, 5000); 

    return () => clearInterval(interval);
  }, []);


  const formatDuration = (start, end) => {
    if (!start) return "0m 0s";

    const startTime = new Date(start);
    const endTime = end ? new Date(end) : new Date();

    const diffMs = endTime - startTime;

    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  };

  return (
  <div className="sessions-page">

    {/* LEFT */}
    <div className="sessions-list">
      <h2>📖 Sessions</h2>

      {sessions.map((s) => (
        <div
          key={s.id}
          className={`session-card ${selected?.id === s.id ? "active" : ""}`}
          onClick={() => setSelected(s)}
        >
          <h4>{s.book?.title}</h4>

          <p>⏱ {formatDuration(s.startTime, s.endTime)}</p>

          <p className="date">
            {new Date(s.startTime).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>

    {/* RIGHT */}
    <div className="session-details">
      {selected ? (
      <div className="details-card fade-in">

  {/* HEADER */}
  <div className="details-header">
    <div>
      <h2>📖 Session Details</h2>
      <h3>{selected.book?.title}</h3>
    </div>

    <span className={`status-badge ${selected.status}`}>
      {selected.status}
    </span>
  </div>

  {/* INFO GRID */}
  <div className="details-grid">

    <div className="detail-item">
      <span>📅 Start</span>
      <p>{new Date(selected.startTime).toLocaleString()}</p>
    </div>

    <div className="detail-item">
      <span>📅 End</span>
      <p>
        {selected.endTime
          ? new Date(selected.endTime).toLocaleString()
          : "Active 🔥"}
      </p>
    </div>

    <div className="detail-item">
      <span>📄 Start page</span>
      <p>{selected.startPage}</p>
    </div>

    <div className="detail-item">
      <span>📄 End page</span>
      <p>{selected.endPage}</p>
    </div>

    <div className="detail-item full">
      <span>⏱ Duration</span>
      <p>{formatDuration(selected.startTime, selected.endTime)}</p>
    </div>

  </div>

</div>
      ) : (
        <p className="empty">👈 Select session to view details</p>
      )}
    </div>

  </div>
);
}



export default ReadingSessions;