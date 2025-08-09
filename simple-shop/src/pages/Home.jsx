import { useEffect, useState } from "react";
import http from "../lib/http";
import Swal from "sweetalert2";
import CardProduct from "../components/CardProduct";
import CardCategory from "../components/CardCategory";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsFailure,
  fetchProductsStart,
  fetchProductsSuccess,
} from "../stores/product";
import {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
} from "../stores/category";


export default function Home() {
  // // const [products, setProducts] = useState([]);
  // const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.data);
  const categories = useSelector((state) => state.category.data);

  async function fetchProducts(search = "", categoryId = "") {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (search.trim()) {
        queryParams.append("search", search.trim());
      }
      if (categoryId) {
        queryParams.append("categoryId", categoryId);
      }

      const queryString = queryParams.toString();
      const url = queryString ? `/products?${queryString}` : "/products";

      dispatch(fetchProductsStart());
      const response = await http({
        method: "GET",
        url: url,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log("Products response:", response.data);
      dispatch(fetchProductsSuccess(response.data));
    } catch (error) {
      console.log("Fetch products error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Failed to fetch products",
      });
      dispatch(fetchProductsFailure(error.message));
    }
  }
  async function fetchCategories() {
    try {
      dispatch(fetchCategoriesStart());
      const response = await http({
        method: "GET",
        url: "/categories",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(response.data, "<<<");
      dispatch(fetchCategoriesSuccess(response.data));
    } catch (error) {
      console.log(error, "<<<");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
      dispatch(fetchProductsFailure(error.message));
    }
  }
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Effect untuk search dan filter dengan debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchProducts(searchQuery, selectedCategory);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, selectedCategory]);

  const handleOrder = async (productId, quantity = 1) => {
    try {
      const response = await http({
        method: "POST",
        url: "/orders",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        data: {
          productId: productId,
          quantity: quantity,
        },
      });

      if (response.status === 201) {
        // Trigger custom event untuk update cart count di Navbar
        window.dispatchEvent(new CustomEvent("cartUpdated"));

        Swal.fire({
          title: "Success!",
          text: "Product added to cart",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.log("Order error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Failed to add to cart",
      });
    }
  };

  return (
    <div className="container-fluid mt-4 ">
      {/* Search Section */}
      <div className="container mb-4">
        <div className="row justify-content-center">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-outline-secondary w-100"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("");
                      }}
                    >
                      All
                    </button>
                  </div>
                </div>
                {(searchQuery || selectedCategory) && (
                  <div className="mt-2">
                    <small className="text-muted">
                      {loading
                        ? "Searching..."
                        : `Found ${products.length} products`}
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h5 className="text-center fw-bold d-flex justify-content-center">
        {" "}
        Choose Categories
      </h5>
      <div className="container overflow-auto">
        <div className="categories-container w-75">
          <div className="categories d-flex  gap-3 py-2">
            {categories.map((category) => (
              <div
                className="flex-shrink-0"
                style={{ minWidth: "120px", cursor: "pointer" }}
                key={category.id}
                onClick={() => setSelectedCategory(category.id.toString())}
              >
                <div
                  className={
                    selectedCategory === category.id.toString()
                      ? "selected-category"
                      : ""
                  }
                >
                  <CardCategory category={category} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-fluid py-5 overflow-auto">
        <h5 className="fw-bold d-flex justify-content-center">
          Choose Products
        </h5>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-5"></div>

          {products.length === 0 && !loading ? (
            <div className="text-center py-5">
              <h4>No products found</h4>
              <p className="text-muted">
                {searchQuery || selectedCategory
                  ? "Try adjusting your search or filters"
                  : "No products available"}
              </p>
              {(searchQuery || selectedCategory) && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="row">
              {products.map((product) => (
                <CardProduct
                  key={product.id}
                  product={product}
                  handleOrder={handleOrder}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
