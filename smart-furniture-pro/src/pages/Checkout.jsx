import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { token, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleConfirmOrder = async () => {
    setError("");
    setSuccess("");

    if (!isAuthenticated) {
      setError("You need to login first");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      setError("Please fill all checkout fields");
      return;
    }

    const items = cartItems.map((item) => ({
      product: item.id,
      name: item.name,
      image: item.image,
      price: Number(item.price),
      quantity: item.quantity,
      size: item.customDimensions ? null : item.size,
      custom_width: item.customDimensions
        ? Number(item.customDimensions.width)
        : null,
      custom_depth: item.customDimensions
        ? Number(item.customDimensions.depth)
        : null,
      custom_height: item.customDimensions
        ? Number(item.customDimensions.height)
        : null,
    }));

    const payload = {
      total_price: Number(totalPrice),
      items,
    };

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/api/orders/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Failed to create order");
      }

      clearCart();
      setSuccess("Order placed successfully");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container section">
      <div className="checkout-box">
        <h2>Checkout</h2>
        <p>Complete your order details.</p>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form
          className="checkout-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleConfirmOrder();
          }}
        >
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <button type="submit" className="btn btn-dark" disabled={loading}>
            {loading ? "Placing Order..." : `Confirm Order - EGP ${totalPrice}`}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Checkout;