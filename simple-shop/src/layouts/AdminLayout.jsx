import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function AdminLayout() {
  const accessToken = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // Jika tidak ada token, redirect ke login
  if (!accessToken) {
    return <Navigate to="/ss/login" replace />;
  }

  // Jika customer mencoba akses route admin, redirect ke home
  if (role === "customer") {
    return <Navigate to="/" replace />;
  }

  // Jika bukan admin, redirect ke login
  if (role !== "admin") {
    return <Navigate to="/ss/login" replace />;
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
