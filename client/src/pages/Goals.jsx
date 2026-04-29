import { useEffect, useState } from "react";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
} from "../api/goals";
import "./Goals.css";


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
  <div className="goals-page">

    <h1>My Reading Goals</h1>

    {/* MODAL */}
    {completedGoal && (
      <div className="goal-overlay">
        <div className="goal-modal">
          <h2>Вітаю!</h2>
          <p>Ціль виконано!</p>

          <p>
             {completedGoal.type.toUpperCase()} goal completed
          </p>

          <button onClick={handleCloseModal}>
            Close & remove goal
          </button>
        </div>
      </div>
    )}

    {/* FORM */}
    <div className="goals-form">
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

    {/* LIST */}
    {goals.map((g) => {
      const percent = Math.min(
        (Number(g.currentCount) / Number(g.targetCount)) * 100 || 0,
        100
      );

      return (
        <div key={g.id} className="goal-card">

          <h3> {g.type.toUpperCase()} goal</h3>

          <p>
            {g.currentCount} / {g.targetCount} books
          </p>

          <div className="goal-bar">
            <div
              className="goal-progress"
              style={{ width: `${percent}%` }}
            />
          </div>

          <p>{Math.round(percent)}%</p>

          <div className="goal-actions">
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


export default Goals;