import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function AuthLayout() {
  const accessToken = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // Jika tidak ada token, redirect ke login
  if (!accessToken) {
    return <Navigate to="/ss/login" replace />;
  }

  // Jika admin mencoba akses route customer, redirect ke admin
  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Jika bukan customer, redirect ke login
  if (role !== "customer") {
    return <Navigate to="/ss/login" replace />;
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}