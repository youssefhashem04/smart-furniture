import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  // Handle image URL - check for backend images or fallback to direct URL
  let imageSrc = product.image;
  if (product.image_url) {
    imageSrc = product.image_url;
  } else if (product.images?.length > 0) {
    imageSrc = product.images[0].image.startsWith('http') 
      ? product.images[0].image 
      : `http://127.0.0.1:8000${product.images[0].image}`;
  }
  
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="240" height="260"%3E%3Crect fill="%23e0e0e0" width="240" height="260"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="%23999"%3EImage Not Available%3C/text%3E%3C/svg%3E';
  };

  return (
    <div className="product-card">
      <button
        className="wishlist-btn"
        onClick={() => toggleWishlist(product)}
        title="Toggle Wishlist"
      >
        {isInWishlist(product.id) ? "♥" : "♡"}
      </button>

      <Link to={`/product/${product.id}`} className="product-link">
        <img 
          src={imageSrc} 
          alt={product.name} 
          className="product-image"
          onError={handleImageError}
        />
        <h3>{product.name}</h3>
      </Link>

      <p className="product-category">{product.category}</p>
      <p className="product-rating">⭐ {product.rating}</p>

      <div className="product-footer">
        <span className="product-price">EGP {product.price}</span>
        <button className="btn btn-dark" onClick={() => addToCart(product, "M")}>
          Add
        </button>
      </div>
    </div>
  );
}

export default ProductCard;