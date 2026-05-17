import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      style={{
        background: "#111",
        color: "#fff",
        marginTop: "60px",
        padding: "30px 0",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3 style={{ marginTop: 0 }}>Smart Furniture</h3>
          <p style={{ color: "#ccc", maxWidth: "320px" }}>
            Smart furniture e-commerce platform for customers, sellers, and admins.
          </p>
        </div>

        <div style={{ display: "grid", gap: "8px" }}>
          <Link to="/" style={{ color: "#fff" }}>Home</Link>
          <Link to="/products" style={{ color: "#fff" }}>Products</Link>
          <Link to="/contact" style={{ color: "#fff" }}>Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;