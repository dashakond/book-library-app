import { Navigate, Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";

function ProtectedLayout() {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  return (
    <div style={styles.layout}>
      <AppSidebar />

      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    height: "100vh"
  },

  content: {
    flex: 1,
    padding: "0px",
    overflowY: "auto"
  }
};

export default ProtectedLayout;