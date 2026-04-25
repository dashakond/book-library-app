import { useEffect, useState } from "react";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
} from "../api/goals";

function Goals() {
  const [goals, setGoals] = useState([]);

  const [form, setForm] = useState({
    type: "month",
    targetCount: 0,
    startDate: "",
    endDate: ""
  });

  // 📌 load goals
  const fetchData = async () => {
    try {
      const res = await getGoals();
      setGoals(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ➕ create goal
  const handleCreate = async () => {
    try {
      await createGoal(form);

      setForm({
        type: "month",
        targetCount: 0,
        startDate: "",
        endDate: ""
      });

      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  // 📈 progress
  const handleProgress = async (id) => {
    try {
      await updateGoal(id);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  // ❌ delete
  const handleDelete = async (id) => {
    try {
      await deleteGoal(id);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🎯 My Reading Goals</h1>

      {/* ➕ FORM */}
      <div style={styles.form}>
        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>

        <input
          type="number"
          placeholder="Target books"
          value={form.targetCount}
          onChange={(e) =>
            setForm({ ...form, targetCount: e.target.value })
          }
        />

        <input
          type="date"
          value={form.startDate}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
        />

        <input
          type="date"
          value={form.endDate}
          onChange={(e) =>
            setForm({ ...form, endDate: e.target.value })
          }
        />

        <button onClick={handleCreate}>Create Goal</button>
      </div>

      {/* 📊 LIST */}
      {goals.map((g) => {
        const percent = Math.min(
          (g.currentCount / g.targetCount) * 100,
          100
        );

        return (
          <div key={g.id} style={styles.card}>
            <h3>📚 {g.type.toUpperCase()} goal</h3>

            <p>
              {g.currentCount} / {g.targetCount} books
            </p>

            {/* progress bar */}
            <div style={styles.bar}>
              <div
                style={{
                  ...styles.progress,
                  width: `${percent}%`
                }}
              />
            </div>

            <p>{Math.round(percent)}%</p>

            <div style={styles.actions}>
              <button onClick={() => handleProgress(g.id)}>
                ➕ Read book
              </button>

              <button onClick={() => handleDelete(g.id)}>
                ❌ Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  form: {
    display: "flex",
    gap: 10,
    marginBottom: 20
  },
  card: {
    border: "1px solid #ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10
  },
  bar: {
    width: "100%",
    height: 10,
    background: "#eee",
    borderRadius: 5,
    marginTop: 10
  },
  progress: {
    height: "100%",
    background: "green",
    borderRadius: 5
  },
  actions: {
    marginTop: 10,
    display: "flex",
    gap: 10
  }
};

export default Goals;