import { useEffect, useState } from "react";
import API from "../api/axios";
import "./Wishlist.css";
function Wishlist() {

  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    link: "",
    note: ""
  });

  const [errors, setErrors] = useState({});

  const startEdit = (item) => {
    setForm({
      title: item.title || "",
      author: item.author || "",
      price: item.price || "",
      link: item.link || "",
      note: item.note || ""
    });

    setEditingItem(item);
    setShowForm(true);
  };
  const updateItem = async () => {
    try {
      if (!validate()) return;

      await API.put(`/wishlist/${editingItem.id}`, form);

      setEditingItem(null);   // 🔥 обовʼязково
      setShowForm(false);

      setForm({
        title: "",
        author: "",
        price: "",
        link: "",
        note: ""
      });

      fetchData();
    } catch (err) {
      console.log(err);
    }
  };


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

      setEditingItem(null); // 🔥 важливо (щоб не застрягло)

      setForm({
        title: "",
        author: "",
        price: "",
        link: "",
        note: ""
      });

      setShowForm(false);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteItem = async (id) => {
    await API.delete(`/wishlist/${id}`);
    fetchData();
  };

  

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>

        <button
          className="add-btn"
          onClick={() => {
            setShowForm(true);
            setEditingItem(null);   // 🔥 ВАЖЛИВО
            setForm({
              title: "",
              author: "",
              price: "",
              link: "",
              note: ""
            });
          }}
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

          <button onClick={editingItem ? updateItem : addItem}>
            {editingItem ? "Update" : "Save"}
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
              <button onClick={() => startEdit(item)}>
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