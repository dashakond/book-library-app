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

  // ➕ add item
  const addItem = async () => {
    try {
      if (!form.title) return alert("Title required");

      await API.post("/wishlist", form);

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

      if (!newTitle) return;

      await API.put(`/wishlist/${id}`, {
        title: newTitle
      });

      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  // download 
  const downloadWishlist = () => {
    const text = [
      " МІЙ ВІШЛІСТ",
      "====================",
      "",
      ...items.map((i, index) =>
        `${index + 1}. ${i.title}
  Автор: ${i.author || "-"}
  Ціна: ${i.price || "-"} ${i.currency || "UAH"}
  Посилання: ${i.link || "-"}
  Нотатка: ${i.note || "-"}
  --------------------`
      )
    ].join("\n");
  
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "wishlist.txt";
    a.click();
  
    URL.revokeObjectURL(url);
  };


  return (
    <div style={{ padding: 20 }}>
      <h1>📌 My Wishlist</h1>

      {/* ⬇️ DOWNLOAD */}
      <button onClick={downloadWishlist} style={styles.downloadBtn}>
        ⬇️ Download Wishlist
      </button>

      {/* ➕ FORM */}
      <div style={styles.form}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />

        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          placeholder="Link"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />

        <button onClick={addItem}>Add</button>
      </div>

      {/* 📚 LIST */}
      {items.map((item) => (
        <div key={item.id} style={styles.card}>
          <h3>{item.title}</h3>
          <p>{item.author}</p>
          <p>{item.price} {item.currency}</p>

          {item.link && (
            <a href={item.link} target="_blank" rel="noreferrer">
              🔗 Open
            </a>
          )}

          <p>{item.note}</p>

          <div style={styles.actions}>
            <button onClick={() => deleteItem(item.id)}>❌ Delete</button>
            <button onClick={() => updateItem(item.id)}>✏️ Edit</button>
          </div>
        </div>
      ))}
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
    padding: 10,
    marginBottom: 10,
    borderRadius: 8
  },
  actions: {
    marginTop: 10,
    display: "flex",
    gap: 10
  },
  downloadBtn: {
    marginBottom: 20,
    padding: 10,
    background: "#333",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};

export default Wishlist;