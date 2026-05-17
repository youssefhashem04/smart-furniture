import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, totalPrice } =
    useContext(CartContext);

  return (
    <section className="container section">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn btn-dark">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div
                key={
                  item.customDimensions
                    ? `${item.id}-${item.customDimensions.width}-${item.customDimensions.depth}-${item.customDimensions.height}`
                    : `${item.id}-${item.size}`
                }
                className="cart-card"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="cart-image"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect fill="%23e0e0e0" width="120" height="120"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />

                <div className="cart-info">
                  <h3>{item.name}</h3>

                  {item.customDimensions ? (
                    <p>
                      Dimensions: {item.customDimensions.width}W ×{" "}
                      {item.customDimensions.depth}D ×{" "}
                      {item.customDimensions.height}H cm
                    </p>
                  ) : (
                    <p>Size: {item.size}</p>
                  )}

                  <p>EGP {item.price}</p>
                </div>

                <div className="qty-box">
                  <button
                    onClick={() =>
                      decreaseQty(item.id, item.size, item.customDimensions)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      increaseQty(item.id, item.size, item.customDimensions)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFromCart(item.id, item.size, item.customDimensions)
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <aside className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Total</span>
              <strong>EGP {totalPrice}</strong>
            </div>
            <Link to="/checkout" className="btn btn-dark full-btn">
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Cart;