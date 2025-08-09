import { useEffect, useState } from "react";
import TableCart from "../components/TableCart";
import http from "../lib/http";
import Button from "../components/Button";
import Swal from "sweetalert2";

export default function Cart() {
  const [order, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const id = localStorage.getItem("id");

  async function fetchOrders() {
    try {
      setLoading(true);
      const response = await http({
        method: "GET",
        url: `/orders`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      console.log("Cart data:", response.data);

      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log("Error fetching cart:", error);
      setError(error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteOrder = async (orderId) => {
    try {
      await http({
        method: "DELETE",
        url: `/orders/${orderId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      // Update state secara langsung
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );

      // Trigger custom event untuk update cart count di Navbar
      window.dispatchEvent(new CustomEvent("cartUpdated"));

      return true;
    } catch (error) {
      console.log("Error deleting order:", error);
      throw error;
    }
  };

  const handleCashless = async () => {
    try {
      // Cek apakah Midtrans Snap sudah dimuat
      if (!window.snap) {
        Swal.fire({
          icon: "error",
          title: "Payment System Not Ready",
          text: "Please refresh the page and try again",
        });
        return;
      }

      const response = await http({
        method: "GET",
        url: "/payment/midtrans/initiate",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      console.log("Payment initiation response:", response.data);

      // Tunggu sebentar untuk memastikan Snap script siap
      setTimeout(() => {
        window.snap.pay(response.data.transactionToken, {
          onSuccess: function (result) {
            console.log("Payment successful:", result);

            // Update status payment ke completed
            http({
              method: "PUT",
              url: "/payment/status",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
              data: {
                status: "completed",
              },
            }).then((updateResponse) => {
              console.log("Status updated:", updateResponse.data);

              // Trigger custom event untuk update cart count di Navbar
              window.dispatchEvent(new CustomEvent("cartUpdated"));

              Swal.fire({
                icon: "success",
                title: "Payment Successful!",
                text: "Your payment has been processed successfully",
              }).then(() => {
                // Refresh cart data
                fetchOrders();
              });
            });
          },
          onPending: function (result) {
            console.log("Payment pending:", result);
            Swal.fire({
              icon: "info",
              title: "Payment Pending",
              text: "Your payment is being processed",
            });
          },
          onError: function (result) {
            console.log("Payment error:", result);
            Swal.fire({
              icon: "error",
              title: "Payment Failed",
              text: "There was an error processing your payment",
            });
          },
          onClose: function () {
            console.log("Payment popup closed");
            Swal.fire({
              icon: "warning",
              title: "Payment Cancelled",
              text: "You cancelled the payment process",
            });
          },
        });
      }, 100);
    } catch (error) {
      console.error("Error initiating payment:", error);
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: error.response?.data?.message || "Failed to initiate payment",
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrders();
    }
  }, [id]);

  useEffect(() => {
    let interval;

    // Polling setiap 5 detik jika ada order unpaid
    if (order.some((o) => o.status === "unpaid")) {
      interval = setInterval(() => {
        fetchOrders();
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [order]);

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">Error loading cart: {error}</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Shopping Cart</h1>

      {order.length === 0 ? (
        <div className="text-center py-5">
          <h4>Your cart is empty</h4>
          <p className="text-muted">
            Add some products to your cart to see them here.
          </p>
        </div>
      ) : (
        <>
          <div className="row">
            {order.map((order) => (
              <div key={order.id} className="col-12 mb-3">
                <TableCart order={order} onDelete={handleDeleteOrder} />
              </div>
            ))}
          </div>
          <div className="mt-4 d-flex justify-content-end gap-2 ">
            <div className="d-flex gap-2">
              <Button title="Checkout" onClick={handleCashless} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
