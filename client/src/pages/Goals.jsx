import { useEffect, useState } from "react";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
} from "../api/goals";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [completedGoal, setCompletedGoal] = useState(null);

  const [form, setForm] = useState({
    type: "month",
    targetCount: 1
  });

  // 📌 load goals
  const fetchData = async () => {
    try {
      const res = await getGoals();

      const sorted = [...res.data].sort((a, b) => {
        const order = { week: 1, month: 2, year: 3 };

        if (order[a.type] !== order[b.type]) {
          return order[a.type] - order[b.type];
        }

        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      setGoals(sorted);
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
      const target = Number(form.targetCount);

      if (target < 1) {
        return alert("Target books must be at least 1");
      }

      await createGoal({
        type: form.type,
        targetCount: target
      });

      setForm({ type: "month", targetCount: 1 });
      fetchData();

    } catch (err) {
      alert(err.response?.data?.message || "Error creating goal");
    }
  };

  // 📈 progress
  const handleProgress = async (id) => {
    try {
      const res = await updateGoal(id);
  
      const updated = res.data;
  
      const isCompleted =
        Number(updated.currentCount) >= Number(updated.targetCount);
  
      // 🔥 1. спочатку оновлюємо список локально (щоб прогрес став 100%)
      setGoals((prev) =>
        prev.map((g) =>
          g.id === id ? updated : g
        )
      );
  
      // 🔥 2. даємо React перемалювати UI
      await new Promise((r) => setTimeout(r, 150));
  
      // 🔥 3. тільки потім показуємо modal
      if (isCompleted) {
        setCompletedGoal(updated);
        return;
      }
  
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

  // 🧠 close + delete
  const handleCloseModal = async () => {
    try {
      if (!completedGoal) return;

      await deleteGoal(completedGoal.id);

      setCompletedGoal(null);
      fetchData();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>

      <h1>🎯 My Reading Goals</h1>

      {/* 🔥 MODAL */}
      {completedGoal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>🎉 Вітаю!</h2>
            <p>Ціль виконано!</p>

            <p>
              📚 {completedGoal.type.toUpperCase()} goal completed
            </p>

            <button onClick={handleCloseModal} style={styles.closeBtn}>
              Close & remove goal
            </button>
          </div>
        </div>
      )}

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
          min="1"
          value={form.targetCount}
          onChange={(e) =>
            setForm({
              ...form,
              targetCount: Number(e.target.value)
            })
          }
        />

        <button onClick={handleCreate}>
          Create Goal
        </button>
      </div>

      {/* 📊 LIST */}
      {goals.map((g) => {
        const percent = Math.min(
          (Number(g.currentCount) / Number(g.targetCount)) * 100 || 0,
          100
        );

        return (
          <div key={g.id} style={styles.card}>
            <h3>📚 {g.type.toUpperCase()} goal</h3>

            <p>
              {g.currentCount} / {g.targetCount} books
            </p>

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
  form: { display: "flex", gap: 10, marginBottom: 20 },
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
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  },
  modal: {
    background: "#fff",
    padding: 30,
    borderRadius: 12,
    textAlign: "center",
    width: 320
  },
  closeBtn: {
    marginTop: 15,
    padding: "8px 15px",
    cursor: "pointer"
  }
};

export default Goals;