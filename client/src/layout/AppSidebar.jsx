import { Link, useLocation } from "react-router-dom";
import {
  HiUser,
  HiBookOpen,
  HiCollection,
  HiHeart,
  HiChartPie,
  HiClock
} from "react-icons/hi";

function AppSidebar() {
  const location = useLocation();

  const items = [
    { path: "/profile", label: "Profile", icon: <HiUser /> },
    { path: "/book", label: "Books", icon: <HiBookOpen /> },
    { path: "/collections", label: "Collections", icon: <HiCollection /> },
    { path: "/wishlist", label: "Wishlist", icon: <HiHeart /> },
    { path: "/goals", label: "Goals", icon: <HiChartPie /> },
    { path: "/sessions", label: "Sessions", icon: <HiClock /> }
  ];

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Readora</h2>

      <div style={styles.menu}>
        {items.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.link,
                background: active ? "#ff6a00" : "transparent",
                color: active ? "#fff" : "#374151"
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "240px",
    height: "100vh",
    background: "#f9fafb",
    borderRight: "1px solid #e5e7eb",
    padding: "20px",
    display: "flex",
    flexDirection: "column"
  },

  logo: {
    marginBottom: "30px",
    fontSize: "30px"
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "10px",
    textDecoration: "none",
    transition: "0.2s",
    fontSize: "20px",
    fontWeight: "500"
  },

  icon: {
    fontSize: "18px"
  }
};

export default AppSidebar;