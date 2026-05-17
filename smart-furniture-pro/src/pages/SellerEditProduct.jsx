import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

function SellerEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, userRole } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "tables",
    image: null,
    description: "",
    has_custom_size: false,
  });

  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/products/${id}/`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to load product");
        }

        setFormData({
          name: data.name || "",
          price: data.price || "",
          category: data.category?.toLowerCase() || "tables",
          image: null,
          description: data.description || "",
          has_custom_size: data.has_custom_size || false,
        });

        setPreviewImage(
          data.images?.[0] || ""
        );

      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

    if (type === "file" && files[0]) {
      setPreviewImage(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (userRole !== "seller" && userRole !== "admin") {
      setError("Only seller or admin can edit products");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("has_custom_size", formData.has_custom_size);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/products/manage/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
  console.log(result);
  alert(JSON.stringify(result));
  throw new Error("Failed to update product");
}

      navigate("/seller/manage-products");

    } catch (err) {
      console.error(err);
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="container section">
        <p>Loading product...</p>
      </section>
    );
  }

  return (
    <section className="container section">
      <div className="checkout-box">
        <h2>Edit Product</h2>

        {error && (
          <p style={{ color: "red", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        <form className="checkout-form" onSubmit={handleSubmit}>

          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "280px",
                objectFit: "cover",
                borderRadius: "14px",
                marginBottom: "15px",
              }}
            />
          )}

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="filter-select"
          >
            <option value="chairs">chairs</option>
            <option value="desks">desks</option>
            <option value="tables">tables</option>
            <option value="beds">beds</option>
            <option value="sofas">sofas</option>
            <option value="wardrobes">wardrobes</option>
            <option value="cabinets">cabinets</option>
            <option value="bookshelves">bookshelves</option>
            <option value="tv units">tv units</option>
            <option value="dining sets">dining sets</option>
            <option value="office furniture">office furniture</option>
            <option value="outdoor furniture">outdoor furniture</option>
          </select>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
          />

          <label
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <input
              type="checkbox"
              name="has_custom_size"
              checked={formData.has_custom_size}
              onChange={handleChange}
            />

            This product supports custom dimensions
          </label>

          <button
            type="submit"
            className="btn btn-dark"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>
    </section>
  );
}

export default SellerEditProduct;