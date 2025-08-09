import { useEffect } from "react";
import http from "../lib/http";
import { useState } from "react";
import ListProduct from "../components/ListProduct";
import { FaChartPie, FaShoppingCart, FaEye } from "react-icons/fa";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk menghitung statistik
  const calculateStats = () => {
    // Total Revenue (dari orders yang completed)
    const totalRevenue = orders
      .filter((order) => order.status === "completed")
      .reduce(
        (total, order) => total + (order.quantity * order.Product.price || 0),
        0
      );

    // Total Orders
    const totalOrders = orders.length;

    // Total Customers (unique users)
    const uniqueCustomers = [...new Set(orders.map((order) => order.userId))]
      .length;

    // Pending Delivery (orders yang pending atau unpaid)
    const pendingDelivery = orders.filter(
      (order) => order.status === "pending" || order.status === "unpaid"
    ).length;

    // Products sold (dari completed orders)
    const productsSold = orders
      .filter((order) => order.status === "completed")
      .reduce((total, order) => total + order.quantity, 0);

    // Stock summary
    const totalStock = products.reduce(
      (total, product) => total + product.stock,
      0
    );

    return {
      totalRevenue,
      totalOrders,
      uniqueCustomers,
      pendingDelivery,
      productsSold,
      totalStock,
      totalProducts: products.length,
      totalCategories: categories.length,
    };
  };

  const stats = calculateStats();

  // Fungsi untuk mendapatkan produk terlaris
  const getTopSellingProducts = () => {
    const productSales = {};

    orders
      .filter((order) => order.status === "completed")
      .forEach((order) => {
        const productId = order.productId;
        if (productSales[productId]) {
          productSales[productId].totalSold += order.quantity;
          productSales[productId].totalRevenue +=
            order.quantity * order.Product.price || 0;
        } else {
          productSales[productId] = {
            product: order.Product,
            totalSold: order.quantity,
            totalRevenue: order.quantity * order.Product.price || 0,
          };
        }
      });

    return Object.values(productSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);
  };

  const topProducts = getTopSellingProducts();

  // Fungsi untuk mendapatkan penjualan terbaru
  const getRecentSales = () => {
    return orders
      .filter((order) => order.status === "completed")
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 8);
  };

  const recentSales = getRecentSales();

  async function fetchProducts() {
    try {
      const response = await http({
        method: "GET",
        url: "/products",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(response.data, "products <<<");
      setProducts(response.data);
    } catch (error) {
      console.log(error, "error fetchProducts");
    }
  }

  async function fetchCategories() {
    try {
      const response = await http({
        method: "GET",
        url: "/categories",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(response.data, "categories <<<");
      setCategories(response.data);
    } catch (error) {
      console.log(error, "error fetchCategories");
    }
  }

  async function fetchOrders() {
    try {
      const response = await http({
        method: "GET",
        url: "/admin/orders",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(response.data, "orders <<<");
      setOrders(response.data);
    } catch (error) {
      console.log(error, "error fetchOrders");
    }
  }

  async function fetchOrderDetails() {
    try {
      const response = await http({
        method: "GET",
        url: "/order-details",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(response.data, "order details <<<");
      setOrderDetails(response.data);
    } catch (error) {
      console.log(error, "error fetchOrderDetails");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchOrderDetails(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading Dashboard...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#f1f3f4", minHeight: "100vh" }}>
      
      <div className="container">

      
      {/* Dashboard Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-end">
            </div>
          </div>
        </div>
      </div>

      {/* Header Stats Cards */}
      <div className="row mb-5">
        {/* Total Revenue */}
        <div className="col-md-3 mb-3">
          <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "16px", transition: "transform 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-2">
                    <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-dollar-sign text-success"></i>
                    </div>
                    <h6 className="text-muted mb-0 fw-semibold">Total Revenue</h6>
                  </div>
                  <h3 className="mb-0 fw-bold text-dark">Rp {stats.totalRevenue.toLocaleString()}</h3>
                  <small className="text-success fw-medium">
                    <i className="fas fa-arrow-up me-1"></i>+12.5% from last month
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="col-md-3 mb-3">
          <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "16px", transition: "transform 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-2">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-shopping-cart text-primary"></i>
                    </div>
                    <h6 className="text-muted mb-0 fw-semibold">Total Orders</h6>
                  </div>
                  <h3 className="mb-0 fw-bold text-dark">{stats.totalOrders}</h3>
                  <small className="text-primary fw-medium">
                    <i className="fas fa-arrow-up me-1"></i>+8.2% from last month
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="col-md-3 mb-3">
          <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "16px", transition: "transform 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-2">
                    <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-users text-info"></i>
                    </div>
                    <h6 className="text-muted mb-0 fw-semibold">Total Customers</h6>
                  </div>
                  <h3 className="mb-0 fw-bold text-dark">{stats.uniqueCustomers}</h3>
                  <small className="text-info fw-medium">
                    <i className="fas fa-arrow-up me-1"></i>+15.3% from last month
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Delivery */}
        <div className="col-md-3 mb-3">
          <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "16px", transition: "transform 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-2">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-truck text-warning"></i>
                    </div>
                    <h6 className="text-muted mb-0 fw-semibold">Pending Delivery</h6>
                  </div>
                  <h3 className="mb-0 fw-bold text-dark">{stats.pendingDelivery}</h3>
                  <small className="text-warning fw-medium">
                    <i className="fas fa-clock me-1"></i>Needs attention
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Analytics & Categories */}
      <div className="row mb-5">
        {/* Sales Analytics */}
        <div className="col-md-8 mb-4">
          <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0 fw-bold text-dark">📊 Sales Analytics</h5>
                <select className="form-select w-auto" style={{ borderRadius: "10px", border: "2px solid #e9ecef" }}>
                  <option>Jul 2023</option>
                </select>
              </div>

              <div className="row text-center">
                <div className="col-4">
                  <div className="p-3 bg-light bg-opacity-50 rounded-3 mb-3">
                    <h6 className="text-muted mb-2 fw-semibold">Income</h6>
                    <h4 className="text-primary fw-bold mb-1">Rp {stats.totalRevenue.toLocaleString()}</h4>
                    <span className="badge bg-success bg-opacity-10 text-success">
                      <i className="fas fa-arrow-up me-1"></i>+10.05%
                    </span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 bg-light bg-opacity-50 rounded-3 mb-3">
                    <h6 className="text-muted mb-2 fw-semibold">Products Sold</h6>
                    <h4 className="text-warning fw-bold mb-1">{stats.productsSold.toLocaleString()}</h4>
                    <span className="badge bg-warning bg-opacity-10 text-warning">
                      <i className="fas fa-arrow-up me-1"></i>+5.09%
                    </span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 bg-light bg-opacity-50 rounded-3 mb-3">
                    <h6 className="text-muted mb-2 fw-semibold">Total Stock</h6>
                    <h4 className="text-success fw-bold mb-1">{stats.totalStock.toLocaleString()}</h4>
                    <span className="badge bg-success bg-opacity-10 text-success">
                      <i className="fas fa-arrow-up me-1"></i>+10.05%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Overview */}
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <div className="card-body p-4 text-center">
              <h5 className="card-title mb-4 fw-bold text-dark">📈 Category Overview</h5>

              <div className="mb-4">
                <div className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "100px", height: "100px" }}>
                  <FaChartPie className="text-primary" size={40} />
                </div>
              </div>

              <div className="row">
                <div className="col-6">
                  <div className="p-3 bg-light bg-opacity-50 rounded-3">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <div className="bg-secondary rounded-circle me-2" style={{ width: "8px", height: "8px" }}></div>
                      <span className="text-muted small fw-semibold">Categories</span>
                    </div>
                    <h4 className="mb-0 fw-bold text-dark">{stats.totalCategories}</h4>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light bg-opacity-50 rounded-3">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <div className="bg-success rounded-circle me-2" style={{ width: "8px", height: "8px" }}></div>
                      <span className="text-muted small fw-semibold">Products</span>
                    </div>
                    <h4 className="mb-0 fw-bold text-dark">{stats.totalProducts}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row - Stock Summary & Top Products */}
      <div className="row mb-5">
        <ListProduct products={products} title="📦 Stock Summary" cardClass="col-md-4 mb-4" />

        {/* Top Selling Products */}
        <div className="col-md-8 mb-4">
          <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0 fw-bold text-dark d-flex align-items-center">
                  🏆 Top Selling Products
                </h5>
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                  Top {topProducts.length} Products
                </span>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e9ecef" }}>
                      <th className="fw-semibold text-muted">Product</th>
                      <th className="fw-semibold text-muted">Price</th>
                      <th className="fw-semibold text-muted">Sold</th>
                      <th className="fw-semibold text-muted">Revenue</th>
                      <th className="fw-semibold text-muted">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((item, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #f8f9fa" }}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="position-relative me-3">
                              <img src={item.product.imgUrl} alt={item.product.name} className="rounded-3" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                              <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-primary" style={{ fontSize: "0.6rem" }}>
                                #{index + 1}
                              </span>
                            </div>
                            <div>
                              <div className="fw-semibold text-dark">{item.product.name}</div>
                              <small className="text-muted">
                                {categories.find((cat) => cat.id === item.product.categoryId)?.name}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="fw-semibold">Rp {item.product.price.toLocaleString()}</td>
                        <td>
                          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2" style={{ borderRadius: "10px" }}>
                            {item.totalSold} pcs
                          </span>
                        </td>
                        <td>
                          <span className="text-success fw-bold">Rp {item.totalRevenue.toLocaleString()}</span>
                        </td>
                        <td>
                          <span className={`badge px-3 py-2 ${item.product.stock <= 10 ? "bg-danger bg-opacity-10 text-danger" : item.product?.stock <= 20 ? "bg-warning bg-opacity-10 text-warning" : "bg-success bg-opacity-10 text-success"}`} style={{ borderRadius: "10px" }}>
                            {item.product.stock}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fourth Row - Recent Sales */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0 fw-bold text-dark d-flex align-items-center">
                  📋 Recent Sales
                </h5>
                <button className="btn btn-primary" style={{ borderRadius: "10px", padding: "8px 20px" }}>
                  <i className="fas fa-eye me-2"></i>View All Sales
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e9ecef" }}>
                      <th className="fw-semibold text-muted">Order ID</th>
                      <th className="fw-semibold text-muted">Product</th>
                      <th className="fw-semibold text-muted">Customer</th>
                      <th className="fw-semibold text-muted">Quantity</th>
                      <th className="fw-semibold text-muted">Amount</th>
                      <th className="fw-semibold text-muted">Status</th>
                      <th className="fw-semibold text-muted">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map((order) => (
                      <tr key={order.id} style={{ borderBottom: "1px solid #f8f9fa" }}>
                        <td>
                          <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2" style={{ borderRadius: "10px" }}>
                            #{order.id.toString().padStart(4, "0")}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img src={order.Product.imgUrl} alt={order.Product.name} className="rounded-3 me-3" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                            <span className="fw-semibold">{order.Product.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="text-muted fw-medium">User #{order.userId}</span>
                        </td>
                        <td>
                          <span className="badge bg-info bg-opacity-10 text-info px-3 py-2" style={{ borderRadius: "10px" }}>
                            {order.quantity} pcs
                          </span>
                        </td>
                        <td>
                          <span className="fw-bold text-dark">Rp {(order.quantity * order.Product.price).toLocaleString()}</span>
                        </td>
                        <td>
                          <span className={`badge px-3 py-2 ${order.status === "completed" ? "bg-success bg-opacity-10 text-success" : order.status === "pending" ? "bg-warning bg-opacity-10 text-warning" : "bg-danger bg-opacity-10 text-danger"}`} style={{ borderRadius: "10px" }}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted fw-medium">
                            {new Date(order.updatedAt).toLocaleDateString("id-ID")}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    
  );
}
