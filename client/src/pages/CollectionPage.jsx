import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function CollectionPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);

  const fetchData = async () => {
    try {
      const res = await API.get("/collections");
      const found = res.data.find((c) => c.id == id);
      setCollection(found);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (!collection) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{collection.name}</h1>

      <h3>Books:</h3>

      {collection.books?.length === 0 && <p>No books yet</p>}

      {collection.books?.map((book) => (
        <div key={book.id} style={{ marginBottom: 10 }}>
          📖 {book.title}
        </div>
      ))}
    </div>
  );
}

export default CollectionPage;