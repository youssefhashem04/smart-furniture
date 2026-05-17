import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function SellerAddProduct() {
  const { token, userRole } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Tables",
    image: null,
    description: "",
    has_custom_size: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (userRole !== "seller" && userRole !== "admin") {
      setError("Only seller or admin can add products");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("has_custom_size", formData.has_custom_size);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await fetch("http://127.0.0.1:8000/api/products/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const text = await response.text();
console.log("RAW RESPONSE:", text);

if (!response.ok) {
  throw new Error(text);
}

      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        throw new Error("Server error (not JSON). Check backend logs.");
      }

      if (!response.ok) {
        throw new Error(result.detail || "Failed to add product");
      }

      setSuccess("Product added successfully");
      window.location.reload();

      setFormData({
        name: "",
        price: "",
        category: formData.category.toLowerCase(),
        image: null,
        description: "",
        has_custom_size: false,
      });

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container section">
      <div className="checkout-box">
        <h2>Add Product</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form className="checkout-form" onSubmit={handleSubmit}>
          
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />

          <select
  name="category"
  value={formData.category}
  onChange={handleChange}
>
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

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="checkbox"
              name="has_custom_size"
              checked={formData.has_custom_size}
              onChange={handleChange}
            />
            This product supports custom dimensions
          </label>

          <button type="submit" className="btn btn-dark" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </button>

        </form>
      </div>
    </section>
  );
}

export default SellerAddProduct;