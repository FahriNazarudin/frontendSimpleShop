import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import LoginLayout from "./layouts/LoginLayout"
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login routes */}
        <Route path="/ss" element={<LoginLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Customer routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          {/* Tambahkan route admin lainnya di sini */}
          {/* <Route path="products" element={<AdminProducts />} /> */}
          {/* <Route path="orders" element={<AdminOrders />} /> */}
          {/* <Route path="users" element={<AdminUsers />} /> */}
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
