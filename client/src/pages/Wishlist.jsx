import { useEffect, useState } from "react";
import API from "../api/axios";
import "./Wishlist.css";

function Wishlist() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false); // 🔥 NEW

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    link: "",
    note: ""
  });

  const [errors, setErrors] = useState({});

  const fetchData = async () => {
    try {
      const res = await API.get("/wishlist");
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.author.trim()) newErrors.author = "Author is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addItem = async () => {
    try {
      if (!validate()) return;

      await API.post("/wishlist", form);

      setForm({
        title: "",
        author: "",
        price: "",
        link: "",
        note: ""
      });

      setErrors({});
      setShowForm(false); // 🔥 ховаємо після додавання
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteItem = async (id) => {
    await API.delete(`/wishlist/${id}`);
    fetchData();
  };

  const updateItem = async (id) => {
    const newTitle = prompt("Enter new title");
    if (!newTitle?.trim()) return;

    await API.put(`/wishlist/${id}`, { title: newTitle });
    fetchData();
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>

        <button
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          + Add book
        </button>
      </div>

      {/* 🔥 FORM (toggle) */}
      {showForm && (
        <div className="wishlist-form fade-in">

          <input
            placeholder="Title *"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className={errors.title ? "error" : ""}
          />
          {errors.title && <span>{errors.title}</span>}

          <input
            placeholder="Author *"
            value={form.author}
            onChange={(e) =>
              setForm({ ...form, author: e.target.value })
            }
            className={errors.author ? "error" : ""}
          />
          {errors.author && <span>{errors.author}</span>}

          <input
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <input
            placeholder="Link"
            value={form.link}
            onChange={(e) =>
              setForm({ ...form, link: e.target.value })
            }
          />

          <button onClick={addItem}>
            Save
          </button>
        </div>
      )}

      {/* 📚 GRID */}
      <div className="wishlist-grid">
        {items.map((item) => (
          <div key={item.id} className="wishlist-card">
            <h3>{item.title}</h3>
            <p>{item.author}</p>

            {item.price && <span className="price">{item.price}</span>}

            {item.link && (
              <a href={item.link} target="_blank">
                🔗 Open
              </a>
            )}

            <div className="actions">
              <button onClick={() => updateItem(item.id)}>
                ✏️
              </button>
              <button onClick={() => deleteItem(item.id)}>
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;