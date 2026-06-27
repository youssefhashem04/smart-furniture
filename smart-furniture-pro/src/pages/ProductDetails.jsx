import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [size, setSize] = useState("M");
  const [reviews, setReviews] = useState([]);

  const [reviewForm, setReviewForm] = useState({
    name: "",
    comment: "",
    rating: 5,
  });

  const [customDimensions, setCustomDimensions] = useState({
    width: "",
    depth: "",
    height: "",
  });

  useEffect(() => {
    fetch(`https://smart-furniture-production.up.railway.app/api/products/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setCustomDimensions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    if (!product) return;

    if (product.has_custom_size) {
      const { width, depth, height } = customDimensions;

      if (!width || !depth || !height) {
        alert("Please enter all dimensions");
        return;
      }

      addToCart(product, null, customDimensions);
    } else {
      addToCart(product, size, null);
    }

    navigate("/cart");
  };

  const handleReviewChange = (e) => {
    setReviewForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    if (!reviewForm.name || !reviewForm.comment) return;

    const newReview = {
      id: Date.now(),
      name: reviewForm.name,
      comment: reviewForm.comment,
      rating: Number(reviewForm.rating),
    };

    setReviews((prev) => [newReview, ...prev]);
    setReviewForm({ name: "", comment: "", rating: 5 });
  };

  if (loading) {
    return (
      <section className="container section">
        <p>Loading product...</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="container section">
        <p>Product not found</p>
      </section>
    );
  }

  return (
    <section className="container section">

      <div className="details-grid">

        <div className="details-image-box">
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            className="details-image"
          />
        </div>

        <div className="details-info">
          <p className="section-label">{product.category}</p>
          <h1>{product.name}</h1>

          <p className="details-rating">⭐ {product.rating}</p>
          <p className="details-price">EGP {product.price}</p>
          <p className="details-description">{product.description}</p>

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button className="btn btn-dark big-btn" onClick={handleAdd}>
              Add To Cart
            </button>

            <button
              className="btn btn-light"
              onClick={() => toggleWishlist(product)}
            >
              {isInWishlist(product.id)
                ? "Remove Wishlist"
                : "Add Wishlist"}
            </button>
          </div>

          {product.has_custom_size ? (
            <div className="size-box">
              <span>Enter Custom Dimensions (cm):</span>

              <div style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
                <input
                  type="number"
                  name="width"
                  placeholder="Width"
                  value={customDimensions.width}
                  onChange={handleDimensionChange}
                  className="search-input"
                />

                <input
                  type="number"
                  name="depth"
                  placeholder="Depth"
                  value={customDimensions.depth}
                  onChange={handleDimensionChange}
                  className="search-input"
                />

                <input
                  type="number"
                  name="height"
                  placeholder="Height"
                  value={customDimensions.height}
                  onChange={handleDimensionChange}
                  className="search-input"
                />
              </div>
            </div>
          ) : (
            <div className="size-box">
              <span>Size:</span>

              <div className="size-options">
                {(product.sizeOptions || ["S", "M", "L"]).map((item) => (
                  <button
                    key={item}
                    className={size === item ? "size-btn active" : "size-btn"}
                    onClick={() => setSize(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="section" style={{ paddingTop: "30px" }}>

        <div className="summary-card" style={{ padding: "24px", marginBottom: "24px" }}>
          <h3>Write a Review</h3>

          <form className="checkout-form" onSubmit={handleReviewSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={reviewForm.name}
              onChange={handleReviewChange}
            />

            <textarea
              name="comment"
              placeholder="Your Comment"
              value={reviewForm.comment}
              onChange={handleReviewChange}
              className="text-area"
            />

            <select
              name="rating"
              value={reviewForm.rating}
              onChange={handleReviewChange}
              className="filter-select"
            >
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <button type="submit" className="btn btn-dark">
              Submit Review
            </button>
          </form>
        </div>

        <div className="summary-card" style={{ padding: "24px" }}>
          <h3>Customer Reviews</h3>

          <div style={{ display: "grid", gap: "14px", marginTop: "14px" }}>
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <strong>{review.name}</strong>
                <p style={{ margin: "6px 0", color: "#666" }}>
                  ⭐ {review.rating}
                </p>
                <p style={{ margin: 0 }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default ProductDetails;