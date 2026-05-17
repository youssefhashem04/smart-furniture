import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminDashboard() {
  const { token } = useContext(AuthContext);

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/products/seller-products/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:8000/api/orders/all/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        const revenue = Array.isArray(ordersData)
          ? ordersData.reduce((sum, order) => sum + Number(order.total_price), 0)
          : 0;

        setStats({
          products: Array.isArray(productsData) ? productsData.length : 0,
          orders: Array.isArray(ordersData) ? ordersData.length : 0,
          revenue,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadStats();
  }, [token]);

  return (
    <section className="container section">
      <div className="section-top">
        <div>
          <p className="section-label">Admin Panel</p>
          <h2>Admin Dashboard</h2>
        </div>
      </div>

      <div className="products-grid" style={{ marginBottom: "24px" }}>
        <div className="summary-card" style={{ padding: "20px" }}>
          <h3>Total Products</h3>
          <p style={{ fontSize: "28px", fontWeight: "700" }}>{stats.products}</p>
        </div>

        <div className="summary-card" style={{ padding: "20px" }}>
          <h3>Total Orders</h3>
          <p style={{ fontSize: "28px", fontWeight: "700" }}>{stats.orders}</p>
        </div>

        <div className="summary-card" style={{ padding: "20px" }}>
          <h3>Total Revenue</h3>
          <p style={{ fontSize: "28px", fontWeight: "700" }}>EGP {stats.revenue}</p>
        </div>
      </div>

      <div className="products-grid">
        <div className="summary-card" style={{ padding: "20px" }}>
          <h3>All Orders</h3>
          <p>Manage and review all orders in the platform.</p>
          <Link to="/admin/orders" className="btn btn-dark">
            View Orders
          </Link>
        </div>

        <div className="summary-card" style={{ padding: "20px" }}>
          <h3>Manage Products</h3>
          <p>Access all products and manage them as admin.</p>
          <Link to="/seller/manage-products" className="btn btn-dark">
            Manage Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;