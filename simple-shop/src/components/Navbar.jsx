import { Link, Navigate, Outlet, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FaCartShopping } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import logo from "../assets/logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
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

  // Fungsi untuk fetch orders dari API
  const fetchOrders = async () => {
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
  };

  // Fetch orders saat component mount
  useEffect(() => {
    if (userRole !== "admin" && localStorage.getItem("access_token")) {
      fetchOrders();
    }
  }, [dispatch, userRole]);

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
  }, [userRole]);

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
              <Link
                to="/cart"
                className="me-4 position-relative text-decoration-none"
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
                navigate("/ss/login");
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
