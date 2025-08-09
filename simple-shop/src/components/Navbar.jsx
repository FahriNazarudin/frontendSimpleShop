import { Link, Navigate, Outlet, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FaCartShopping } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import logo from "../assets/logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
} from "../stores/order";
import http from "../lib/http";

export default function Navbar() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const userName = localStorage.getItem("name");
  const dispatch = useDispatch();

  // Ambil data dari Redux store
  const orders = useSelector((state) => state.order.data);
  const cartCount = orders.filter((order) => order.status === "unpaid").length;
  
  // Hitung total belanjaan untuk order yang unpaid
  const totalAmount = orders
    .filter((order) => order.status === "unpaid")
    .reduce((total, order) => {
      return total + (order.quantity * order.Product.price);
    }, 0);

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  // Fungsi untuk fetch orders dari API
  const fetchOrders = useCallback(async () => {
    try {
      dispatch(fetchOrdersStart());

      const response = await http({
        method: "GET",
        url: "/orders",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (Array.isArray(response.data)) {
        dispatch(fetchOrdersSuccess(response.data));
      } else {
        dispatch(fetchOrdersSuccess([]));
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
      dispatch(fetchOrdersFailure(error.message));
    }
  }, [dispatch]);

  // Fetch orders saat component mount
  useEffect(() => {
    if (userRole !== "admin" && localStorage.getItem("access_token")) {
      fetchOrders();
    }
  }, [dispatch, userRole, fetchOrders]);

  // Listen untuk custom event cart update
  useEffect(() => {
    const handleCartUpdate = () => {
      if (userRole !== "admin" && localStorage.getItem("access_token")) {
        fetchOrders();
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [userRole, fetchOrders]);

  return (
    <div className="container-fluid" style={{ backgroundColor: "#ffffffff" }}>
      <nav className="navbar bg-body-tertiary ">
        <div
          className="container-fluid"
          style={{ backgroundColor: "#ffffffff" }}
        >
          <Link to="/" className="navbar-brand text-decoration-none">
            <img src={logo} alt="" style={{ height: "60px" }} />
          </Link>
          <div className="d-flex align-items-center">
            {userRole !== "admin" && (
              <div className="d-flex align-items-center me-4">
                <Link
                  to="/cart"
                  className="position-relative text-decoration-none"
                  style={{
                    fontSize: "24px",
                    color: "#ffb700ff",
                  }}
                >
                  <FaCartShopping />
                  {cartCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "10px" }}
                    >
                      {cartCount}
                      <span className="visually-hidden">cart items</span>
                    </span>
                  )}
                </Link>
                {totalAmount > 0 && (
                  <div className="ms-2">
                    <small className="text-muted d-block" style={{ fontSize: "10px" }}>
                      Total
                    </small>
                    <span 
                      className="fw-bold" 
                      style={{ 
                        fontSize: "12px", 
                        color: "#ffb700ff" 
                      }}
                    >
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div>
              <span
                className="text-muted me-3"
                style={{ fontWeight: "bold", fontSize: "16px" }}
              >
                {userRole === "admin"
                  ? "Admin"
                  : `Hello, ${userName || "User"}`}
              </span>
            </div>
            <Link
              to="/ss/login"
              className="btn btn-warning d-flex align-items-center gap-2 p-2 "
              style={{ fontSize: "14px", padding: "8px 16px", color: "#fff" }}
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("id");
                localStorage.removeItem("role");
                localStorage.removeItem("name");
                Swal.fire({
                  title: "Logout success!",
                  icon: "success",
                  draggable: true,
                });
                navigate("/login");
              }}
            >
              Logout <IoIosLogOut />
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
