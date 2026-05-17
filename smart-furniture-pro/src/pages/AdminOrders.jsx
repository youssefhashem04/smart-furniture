import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function AdminOrders() {
  const { token, isAuthenticated, userRole } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders/all/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to load admin orders");
      }

      setOrders(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
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

    if (userRole !== "admin") {
      setError("Only admin can view this page");
      setLoading(false);
      return;
    }

    fetchOrders();
  }, [token, isAuthenticated, userRole]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/orders/update-status/${orderId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update status");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert(err.message || "Status update failed");
    }
  };

  return (
    <section className="container section">
      <div className="section-top">
        <div>
          <p className="section-label">Admin Panel</p>
          <h2>All Orders</h2>
        </div>
      </div>

      {loading && <p>Loading admin orders...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && orders.length === 0 && <p>No orders found.</p>}

      {!loading && !error && orders.length > 0 && (
        <div style={{ display: "grid", gap: "20px" }}>
          {orders.map((order) => (
            <div key={order.id} className="summary-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
                <div>
                  <h3 style={{ margin: 0 }}>Order #{order.id}</h3>
                  <p style={{ marginTop: "8px", color: "#666" }}>
                    Customer: {order.username}
                  </p>
                  <p style={{ marginTop: "8px", color: "#666" }}>
                    Status: {order.status}
                  </p>
                </div>

                <strong>EGP {order.total_price}</strong>
              </div>

              <div style={{ marginTop: "14px", marginBottom: "14px" }}>
                <select
                  className="filter-select"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="pending">pending</option>
                  <option value="processing">processing</option>
                  <option value="delivered">delivered</option>
                </select>
              </div>

              <div style={{ display: "grid", gap: "14px", marginTop: "16px" }}>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "90px 1fr",
                      gap: "14px",
                      border: "1px solid #eee",
                      borderRadius: "14px",
                      padding: "12px",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="90" height="90"%3E%3Crect fill="%23e0e0e0" width="90" height="90"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="10" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />

                    <div>
                      <h4 style={{ margin: "0 0 6px" }}>{item.name}</h4>
                      <p style={{ margin: "4px 0", color: "#666" }}>Quantity: {item.quantity}</p>
                      <p style={{ margin: "4px 0", color: "#666" }}>Price: EGP {item.price}</p>

                      {item.custom_width || item.custom_depth || item.custom_height ? (
                        <p style={{ margin: "4px 0", color: "#666" }}>
                          Dimensions: {item.custom_width}W × {item.custom_depth}D × {item.custom_height}H cm
                        </p>
                      ) : (
                        <p style={{ margin: "4px 0", color: "#666" }}>
                          Size: {item.size || "N/A"}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ marginTop: "16px", color: "#777" }}>
                Created at: {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminOrders;