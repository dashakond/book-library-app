import API from "./axios";

// 📌 отримати цілі
export const getGoals = () => API.get("/goals");

// ➕ створити ціль
export const createGoal = (data) => API.post("/goals", data);

// 📈 оновити прогрес
export const updateGoal = (id) =>
    API.put(`/goals/${id}/progress`);

// ❌ видалити
export const deleteGoal = (id) =>
    API.delete(`/goals/${id}`);