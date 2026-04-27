import { useEffect, useState } from "react";
import API from "../api/axios";

function Wishlist() {
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    link: "",
    note: ""
  });

  const [errors, setErrors] = useState({});

  // 📌 load wishlist
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

  // 🔥 VALIDATION
  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.author.trim()) {
      newErrors.author = "Author is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ➕ add item
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
      fetchData();

    } catch (err) {
      console.log(err);
    }
  };

  // ❌ delete
  const deleteItem = async (id) => {
    try {
      await API.delete(`/wishlist/${id}`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  // ✏️ edit
  const updateItem = async (id) => {
    try {
      const newTitle = prompt("Enter new title");
      if (!newTitle?.trim()) return;

      await API.put(`/wishlist/${id}`, {
        title: newTitle
      });

      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📌 My Wishlist</h1>

      {/* ➕ FORM */}
      <div style={styles.form}>

        {/* TITLE */}
        <div>
          <input
            placeholder="Title *"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            style={errors.title ? styles.errorInput : {}}
          />
          {errors.title && (
            <p style={styles.errorText}>{errors.title}</p>
          )}
        </div>

        {/* AUTHOR */}
        <div>
          <input
            placeholder="Author *"
            value={form.author}
            onChange={(e) =>
              setForm({ ...form, author: e.target.value })
            }
            style={errors.author ? styles.errorInput : {}}
          />
          {errors.author && (
            <p style={styles.errorText}>{errors.author}</p>
          )}
        </div>

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
          Add
        </button>
      </div>

      {/* 📚 LIST */}
      {items.map((item) => (
        <div key={item.id} style={styles.card}>
          <h3>{item.title}</h3>
          <p>{item.author}</p>
          <p>{item.price}</p>

          {item.link && (
            <a href={item.link} target="_blank" rel="noreferrer">
              🔗 Open
            </a>
          )}

          <p>{item.note}</p>

          <div style={styles.actions}>
            <button onClick={() => deleteItem(item.id)}>
              ❌ Delete
            </button>
            <button onClick={() => updateItem(item.id)}>
              ✏️ Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 20,
    maxWidth: 300
  },

  card: {
    border: "1px solid #ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8
  },

  actions: {
    marginTop: 10,
    display: "flex",
    gap: 10
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2
  },

  errorInput: {
    border: "1px solid red"
  }
};

export default Wishlist;