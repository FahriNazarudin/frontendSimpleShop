import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import http from "../lib/http";
import Swal from "sweetalert2";
import logo from "../assets/logo.jpg";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  if (localStorage.getItem("access_token")) {
    return <Navigate to="/" />;
  }

  return (
    <div
      className="container-fluid vh-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="p-4 bg-white rounded-4 shadow-lg w-50"
        style={{ width: "400px", maxWidth: "90%" }}
      >
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="logo"
            style={{
              height: "100px",
            }}
          />
          <p className="text-muted mb-0">Join us today and start shopping</p>
        </div>

        <form
          onSubmit={async (event) => {
            event.preventDefault();

            try {
              const response = await http({
                method: "POST",
                url: "/register",
                data: {
                  name,
                  email,
                  password,
                  phone,
                },
              });
              console.log(response.data, "<<<");
              Swal.fire({
                title: "Register Success!",
                icon: "success",
                draggable: true,
              });

              navigate("/ss/login");
            } catch (error) {
              console.log(error);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          }}
        >
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">
              Full Name
            </label>
            <input
              type="text"
              className="form-control form-control-lg border-2"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              style={{
                borderRadius: "10px",
                padding: "12px 16px",
                transition: "all 0.3s ease",
                borderColor: "#e9ecef",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#0d6efd")}
              onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">
              Email Address
            </label>
            <input
              type="email"
              className="form-control form-control-lg border-2"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              style={{
                borderRadius: "10px",
                padding: "12px 16px",
                transition: "all 0.3s ease",
                borderColor: "#e9ecef",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#0d6efd")}
              onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">Password</label>
            <input
              type="password"
              className="form-control form-control-lg border-2"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              style={{
                borderRadius: "10px",
                padding: "12px 16px",
                transition: "all 0.3s ease",
                borderColor: "#e9ecef",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#0d6efd")}
              onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold text-dark">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control form-control-lg border-2"
              value={phone}
              required
              onChange={(e) => setPhone(e.target.value)}
              style={{
                borderRadius: "10px",
                padding: "12px 16px",
                transition: "all 0.3s ease",
                borderColor: "#e9ecef",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#0d6efd")}
              onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 btn-lg fw-semibold"
            style={{
              borderRadius: "10px",
              padding: "12px",
              transition: "all 0.3s ease",
              background: "linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)",
              border: "none",
            }}
            onMouseEnter={(e) =>
              (e.target.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0px)")}
          >
            Create Account
          </button>
        </form>

        <div
          className="text-center mt-4 pt-3"
          style={{ borderTop: "1px solid #e9ecef" }}
        >
          <span className="text-muted">Already have an account? </span>
          <Link
            to="/ss/login"
            className="text-decoration-none fw-semibold"
            style={{ color: "#0d6efd" }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
