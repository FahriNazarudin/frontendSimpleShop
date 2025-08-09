import { FaExclamationTriangle, FaBox, FaCheckCircle } from "react-icons/fa";

export default function ListProduct(props) {
  const { products } = props;


  const calculateStockStats = () => {
    const lowStockCount = products.filter(
      (product) => product.stock > 0 && product.stock <= 10
    ).length;
    const outOfStockCount = products.filter(
      (product) => product.stock === 0
    ).length;
    const goodStockCount = products.filter(
      (product) => product.stock > 10
    ).length;

    return {
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
      goodStock: goodStockCount,
      totalProducts: products.length,
    };
  };

  const stats = calculateStockStats();


  const calculatePercentage = (count) => {
    if (stats.totalProducts === 0) return 0;
    return Math.round((count / stats.totalProducts) * 100);
  };

  return (
    <div className="col mb-3">
      <div className="card h-100 border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3 d-flex align-items-center">
            <FaBox className="me-2 text-primary" />
            Stock Products
          </h5>

          {/* Low Stock Alert */}
          <div className="mb-3 p-3 bg-light rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="d-flex align-items-center">
                <FaExclamationTriangle className="me-2 text-danger" />
                Low Stock Alert
              </span>
              <span className="text-danger fw-bold">{stats.lowStock}</span>
            </div>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className="progress-bar bg-danger"
                style={{ width: `${calculatePercentage(stats.lowStock)}%` }}
              ></div>
            </div>
            <small className="text-muted">Products with stock ≤ 10</small>
          </div>

          {/* Out of Stock */}
          <div className="mb-3 p-3 bg-light rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="d-flex align-items-center">
                <FaBox className="me-2 text-warning" />
                Out of Stock
              </span>
              <span className="text-warning fw-bold">{stats.outOfStock}</span>
            </div>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className="progress-bar bg-warning"
                style={{ width: `${calculatePercentage(stats.outOfStock)}%` }}
              ></div>
            </div>
            <small className="text-muted">Products with no stock</small>
          </div>

          {/* Good Stock */}
          <div className="mb-3 p-3 bg-light rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="d-flex align-items-center">
                <FaCheckCircle className="me-2 text-success" />
                Good Stock
              </span>
              <span className="text-success fw-bold">{stats.goodStock}</span>
            </div>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className="progress-bar bg-success"
                style={{ width: `${calculatePercentage(stats.goodStock)}%` }}
              ></div>
            </div>
            <small className="text-muted">
              Products with good stock ( &gt; 10)
            </small>
          </div>

          {/* Summary */}
          <div className="mt-4 pt-3 border-top">
            <div className="d-flex justify-content-between text-muted">
              <small>Total Products:</small>
              <small className="fw-bold">{stats.totalProducts}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
