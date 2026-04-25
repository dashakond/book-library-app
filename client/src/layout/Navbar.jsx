import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.left}>
        <Link to="/profile">Profile</Link>
        <Link to="/book">Books</Link>
        <Link to="/collections">Collections</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/goals">Goals</Link>
      </div>

      <button onClick={handleLogout} style={styles.btn}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 20px",
    background: "#222",
    color: "white"
  },
  left: {
    display: "flex",
    gap: "15px"
  },
  btn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer"
  }
};

export default Navbar;