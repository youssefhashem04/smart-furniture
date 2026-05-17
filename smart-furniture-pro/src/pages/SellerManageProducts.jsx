import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function SellerManageProducts() {
  const { token, isAuthenticated, userRole } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("PRODUCTS STATE =", products);
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/api/products/seller-products/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned HTML instead of JSON");
      }

      if (!response.ok) {
        throw new Error(data.detail || "Failed to load products");
      }

      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setError("You need to login first");
      setLoading(false);
      return;
    }

    if (userRole !== "seller" && userRole !== "admin") {
      setError("Only seller or admin can view this page");
      setLoading(false);
      return;
    }

    if (token) fetchProducts();
  }, [token, isAuthenticated, userRole]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/manage/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section className="container section">
      <div className="section-top">
        <div>
          <p className="section-label">Seller Panel</p>
          <h2>Manage Products</h2>
        </div>

        <Link to="/seller/add-product" className="btn btn-dark">
          Add New Product
        </Link>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>No products found.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="seller-product-item" style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
              
              <ProductCard product={product} />

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "15px",
                  background: "#fff"
                }}
              >
                <Link
                  to={`/seller/edit-product/${product.id}`}
                  className="btn btn-light"
                  style={{ flex: 1, textAlign: 'center', fontSize: '14px' }}
                >
                  Edit
                </Link>

                <button
                  className="btn btn-dark"
                  style={{ flex: 1, fontSize: '14px' }}
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default SellerManageProducts;