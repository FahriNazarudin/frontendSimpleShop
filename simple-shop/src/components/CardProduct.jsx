import { useState } from "react";

export default function CardProduct(props) {
  const { product, handleOrder } = props;
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleOrderClick = async (e) => {
    e.preventDefault();
    if (handleOrder && !isLoading) {
      setIsLoading(true);
      try {
        await handleOrder(product.id, quantity);
        setQuantity(1); // Reset quantity after successful order
      } catch (error) {
        console.error("Order failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="card h-100 shadow-sm border-0 product-card">
        {/* Image Container */}
        <div className="card-img-container position-relative overflow-hidden">
          <img
            src={product.imgUrl || "https://via.placeholder.com/300x200"}
            className="card-img-top product-image"
            alt={product.name}
            style={{
              height: "200px",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
          />
          {product.stock <= 5 && product.stock > 0 && (
            <span className="position-absolute top-0 end-0 badge bg-warning text-dark m-2">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="position-absolute top-0 end-0 badge bg-danger m-2">
              Out of Stock
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate mb-2" title={product.name}>
            {product.name}
          </h5>

          <p
            className="card-text text-muted small mb-2"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: "1.4em",
              height: "2.8em",
            }}
          >
            {product.description}
          </p>

          <div className="mt-auto">
            {/* Price */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="h5 text-primary mb-0 fw-bold">
                {formatPrice(product.price)}
              </span>
              <small className="text-muted">
                Stock:{" "}
                <span
                  className={`fw-bold ${
                    product.stock <= 5 ? "text-warning" : "text-success"
                  }`}
                >
                  {product.stock}
                </span>
              </small>
            </div>

            {/* Category Badge */}
            <div className="mb-3">
              <span className="badge bg-light text-dark border">
                {product.Category?.name || `Category ${product.categoryId}`}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-3">
                <label className="form-label small">Quantity:</label>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control form-control-sm mx-2 text-center"
                    style={{ width: "60px" }}
                    value={quantity}
                    min="1"
                    max={product.stock}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value) || 1)
                    }
                  />
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Order Button */}
            <button
              className={`btn w-100 ${
                product.stock > 0 ? "btn-primary" : "btn-secondary"
              }`}
              onClick={handleOrderClick}
              disabled={product.stock === 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Adding...
                </>
              ) : product.stock > 0 ? (
                <>
                  <i className="bi bi-cart-plus me-2"></i>
                  Add to Cart
                </>
              ) : (
                "Out of Stock"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
