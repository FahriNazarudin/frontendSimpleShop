import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import http from "../lib/http";
import Swal from "sweetalert2";
import logo from "../assets/logo.jpg"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        className="p-5 bg-white rounded-4 shadow-lg w-50"
        style={{ width: "400px", maxWidth: "90%" }}
      >
        <div className="text-center mb-4 ">
          <img
            src={logo}
            alt="logo"
            style={{
              height: "100px",
            }}
          />
          <p className="text-muted mb-0 mt-4">Welcome back, please login!</p>
        </div>

        <form
          onSubmit={async (event) => {
            event.preventDefault();

            try {
              const response = await http({
                method: "POST",
                url: "/login",
                data: {
                  email,
                  password,
                },
              });
              console.log(response.data, "<<<");
              Swal.fire({
                title: "Login Success!",
                icon: "success",
                draggable: true,
              });
                localStorage.setItem(
                  "access_token",
                  response.data.access_token
                );
                localStorage.setItem("id", response.data.id);
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("name", response.data.name);


              if (response.data.role === "admin") {
                navigate("/admin");
              } else {
                navigate("/");
              }
            } catch (error) {
              console.log(error);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Email or Password Invalid!",
              });
            }
          }}
        >
          <div className="mb-4">
            <label
              htmlFor="exampleInputEmail1"
              className="form-label fw-semibold text-dark"
            >
              Email Address
            </label>
            <input
              type="email"
              className="form-control form-control-lg border-2"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              style={{
                borderRadius: "10px",
                padding: "12px 16px",
                transition: "all 0.3s ease",
                borderColor: "#e9ecef",
              }}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="exampleInputPassword1"
              className="form-label fw-semibold text-dark"
            >
              Password
            </label>
            <input
              type="password"
              className="form-control form-control-lg border-2"
              id="exampleInputPassword1"
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
            Sign In
          </button>
        </form>

        <div
          className="text-center mt-4 pt-3"
          style={{ borderTop: "1px solid #e9ecef" }}
        >
          <span className="text-muted">Don't have an account? </span>
          <Link
            to="/ss/register"
            className="text-decoration-none fw-semibold"
            style={{ color: "#0d6efd" }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
