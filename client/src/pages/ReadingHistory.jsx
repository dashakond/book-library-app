import { useEffect, useState } from "react";
import API from "../api/axios";

function ReadingSessions() {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);

  // 📌 load sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await API.get("/sessions");
        setSessions(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSessions();
  }, []);

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
              background: selected?.id === s.id ? "#eee" : "#fff"
            }}
            onClick={() => setSelected(s)}
          >
            <h4>{s.book?.title}</h4>

            <p>⏱ {s.durationMinutes || 0} min</p>

            <p>{new Date(s.startTime).toLocaleDateString()}</p>
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

            <p>⏱ Time: {selected.durationMinutes} min</p>

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
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    cursor: "pointer"
  }
};

export default ReadingSessions;