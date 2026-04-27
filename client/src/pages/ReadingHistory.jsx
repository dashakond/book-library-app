import { useEffect, useState } from "react";
import API from "../api/axios";

function ReadingSessions() {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchSessions = async () => {
    try {
      const res = await API.get("/sessions");
  
      // 🔥 сортування: нові зверху
      const sorted = res.data.sort((a, b) => {
        return new Date(b.startTime) - new Date(a.startTime);
      });
  
      setSessions(sorted);
  
    } catch (err) {
      console.log(err);
    }
  };

  // 📌 load sessions + live update
  useEffect(() => {
    fetchSessions();

    // 🔥 автооновлення (щоб нові сесії з’являлись)
    const interval = setInterval(() => {
      fetchSessions();
    }, 5000); // кожні 5 сек

    return () => clearInterval(interval);
  }, []);

  // 🔥 FORMAT TIME (хв + сек)
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
    <div style={styles.container}>
      
      {/* 📚 LEFT: LIST */}
      <div style={styles.list}>
        <h2>📖 Sessions</h2>

        {sessions.map((s) => (
          <div
            key={s.id}
            style={{
              ...styles.item,
              background: selected?.id === s.id ? "#f3f4f6" : "#fff"
            }}
            onClick={() => setSelected(s)}
          >
            <h4>{s.book?.title}</h4>

            <p>⏱ {formatDuration(s.startTime, s.endTime)}</p>

            <p>
              {new Date(s.startTime).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* 📊 RIGHT: DETAILS */}
      <div style={styles.details}>
        {selected ? (
          <>
            <h2>📖 Session Details</h2>

            <h3>{selected.book?.title}</h3>

            <p>
              📅 Start:{" "}
              {new Date(selected.startTime).toLocaleString()}
            </p>

            <p>
              📅 End:{" "}
              {selected.endTime
                ? new Date(selected.endTime).toLocaleString()
                : "Active"}
            </p>

            <p>📄 Start page: {selected.startPage}</p>
            <p>📄 End page: {selected.endPage}</p>

            <p>
              ⏱ Time:{" "}
              {formatDuration(
                selected.startTime,
                selected.endTime
              )}
            </p>

            <p>Status: {selected.status}</p>
          </>
        ) : (
          <p>👈 Select session to view details</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: 20,
    padding: 20
  },

  list: {
    width: "40%",
    borderRight: "1px solid #ddd",
    paddingRight: 10
  },

  details: {
    width: "60%",
    padding: 10
  },

  item: {
    border: "1px solid #ddd",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    cursor: "pointer",
    transition: "0.2s"
  }
};

export default ReadingSessions;