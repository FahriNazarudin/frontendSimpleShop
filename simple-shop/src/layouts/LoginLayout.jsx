import { Navigate, Outlet } from "react-router";

export default function LoginLayout() {
  const accessToken = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (accessToken) {
    // Redirect berdasarkan role setelah login
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (role === "customer") {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
