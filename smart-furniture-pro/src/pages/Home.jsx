import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { useEffect, useState, useMemo } from "react";

function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. جلب المنتجات من الـ API بدلاً من الملف الثابت
  useEffect(() => {
    fetch("http://localhost:8000/api/products/")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // 2. حساب الـ Popular picks (أعلى 3 تقييماً) ديناميكياً
  const featured = useMemo(() => {
    return [...allProducts]
      .sort((a, b) => b.rating - a.rating) // ترتيب من الأكبر للأصغر
      .slice(0, 3); // أخذ أول 3 عناصر
  }, [allProducts]);

  const heroImages = [
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    "https://images.unsplash.com/photo-1497366216548-37526070297c",
    "https://smartfurniture.com.eg/wp-content/uploads/2021/08/IMG_0007-2-1.jpg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <>
      {/* HERO SECTION */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${heroImages[current]})`,
        }}
      >
        <div className="hero-overlay">
          <div className="container hero-grid">
            <div>
              <p className="hero-badge">Smart marketplace for Egypt</p>
              <h1>
                Buy furniture online with a cleaner, smarter experience.
              </h1>

              <p className="hero-text">
                Browse local sellers, compare products, customize sizes, read reviews,
                and place your order through a modern furniture marketplace.
              </p>

              <div className="hero-actions">
                <Link to="/products" className="btn btn-dark">
                  Shop Products
                </Link>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-panel">
                <span>Responsive UI</span>
                <strong> Buyers • Sellers • Admin</strong>
              </div>

              <div className="hero-panel">
                <span>Features</span>
                <strong> Search • Cart • Reviews</strong>
              </div>

              <div className="hero-panel">
                <span>Support</span>
                <strong> Order tracking + AI chatbot</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container section">
        <SectionHeader
          label="Featured"
          title="Popular picks"
        />

        {loading ? (
          <p>Loading popular products...</p>
        ) : (
          <div className="products-grid">
            {featured.length > 0 ? (
              featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default Home;