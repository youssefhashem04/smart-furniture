import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function Wishlist() {
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  return (
    <section className="container section">
      <div className="section-top">
        <div>
          <p className="section-label">Favorites</p>
          <h2>Wishlist</h2>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-state">
          <p>Your wishlist is empty.</p>
          <Link to="/products" className="btn btn-dark">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {wishlistItems.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="product-link">
                <img
                  src={product.image_url || product.image}
                  alt={product.name}
                  className="product-image"                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"240\" height=\"260\"%3E%3Crect fill=\"%23e0e0e0\" width=\"240\" height=\"260\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"16\" fill=\"%23999\"%3EImage Not Available%3C/text%3E%3C/svg%3E';
                  }}                />
                <h3>{product.name}</h3>
              </Link>

              <p className="product-category">{product.category}</p>
              <p className="product-rating">⭐ {product.rating}</p>

              <div className="product-footer">
                <span className="product-price">EGP {product.price}</span>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                <button className="btn btn-dark" onClick={() => addToCart(product, "M")}>
                  Add To Cart
                </button>
                <button className="btn btn-light" onClick={() => toggleWishlist(product)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Wishlist;