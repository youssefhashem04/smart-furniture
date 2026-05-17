import { useMemo, useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [customSize, setCustomSize] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetch("http://localhost:8000/api/products/")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setAllProducts([]);
        setLoading(false);
      });
  }, []);

  const hasCustomProducts = allProducts.some(
    (p) => p?.has_custom_size === true
  );

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (search) {
      filtered = filtered.filter((product) =>
        product?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      filtered = filtered.filter(
        (product) =>
          product?.category?.toLowerCase() === category
      );
    }

    if (customSize !== "all") {
      filtered = filtered.filter(
        (product) =>
          String(product?.has_custom_size) === customSize
      );
    }

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [allProducts, search, category, customSize, sortBy]);

  if (loading) {
    return (
      <section className="container section">
        <p>Loading products...</p>
      </section>
    );
  }

  return (
    <section className="container section">

      <div className="section-top">
        <div>
          <p className="section-label">Our Collection</p>
          <h2>Browse Products</h2>
        </div>

        <div className="filters-bar">

          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filters-row">

            <div className="filter-group">
  <label>Category</label>
  <select
    className="filter-select"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  >
    <option value="all">All</option>

    <option value="chairs">Chairs</option>
    <option value="desks">Desks</option>
    <option value="tables">Tables</option>
    <option value="beds">Beds</option>
    <option value="sofas">Sofas</option>

    <option value="wardrobes">Wardrobes</option>
    <option value="cabinets">Cabinets</option>
    <option value="bookshelves">Bookshelves</option>
    <option value="tv units">TV Units</option>
    <option value="dining sets">Dining Sets</option>
    <option value="office furniture">Office Furniture</option>
    <option value="outdoor furniture">Outdoor Furniture</option>

  </select>
</div>

            {hasCustomProducts && (
              <div className="filter-group">
                <label>Custom Size</label>
                <select
                  className="filter-select"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>
            )}

            <div className="filter-group">
              <label>Sort By</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="price-low">Price ↑</option>
                <option value="price-high">Price ↓</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <button
              className="btn btn-light"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setCustomSize("all");
                setSortBy("default");
              }}
            >
              Reset
            </button>

          </div>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <p>No products found.</p>
      )}

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

    </section>
  );
}

export default Products;