import Swal from "sweetalert2";
import Button from "./Button";
import { useState } from "react";

export default function TableCart(props) {
  const { order, onDelete } = props;
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPrice = order.quantity * order.Product.price;
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "unpaid":
        return "bg-warning";
      case "pending":
        return "bg-primary";
      case "completed":
        return "bg-success";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Remove ${order.Product.name} from cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0037ffff",
      confirmButtonText: "Yes, remove it!",
    });

    if (result.isConfirmed) {
      try {
        setIsDeleting(true);

        await onDelete(order.id);

        Swal.fire({
          title: "Removed!",
          text: "Item has been removed from your cart.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error deleting order:", error);
        // Show error message
        Swal.fire({
          title: "Error!",
          text:
            error.response?.data?.message || "Failed to remove item from cart",
          icon: "error",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-2">
            <img
              src={order.Product.imgUrl}
              alt={order.Product.name}
              className="img-fluid rounded"
              style={{ maxHeight: "80px" }}
            />
          </div>
          <div className="col">
            <h6 className="mb-1">{order.Product.name}</h6>
            <small className="text-muted">{order.Product.Category.name}</small>
          </div>
          <div className="col">
            <span>{formatPrice(order.Product.price)}</span>
          </div>
          <div className="col">
            <span>Qty: {order.quantity}</span>
          </div>
          <div className="col ">
            <span
              className={`badge ${getStatusBadge(order.status)} p-2 rounded-4`}
            >
              {order.status.replace("_", " ").toUpperCase()}
            </span>
          </div>
          <div className="col">
            <strong>{formatPrice(totalPrice)}</strong>
          </div>
          <div className="col">
            <Button
              title="Delete"
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
