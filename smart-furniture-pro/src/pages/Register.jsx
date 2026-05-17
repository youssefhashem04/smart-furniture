import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const { username, email, password, role } = formData;

      if (!username || !email || !password) {
        throw new Error("Please fill in all fields");
      }

      if (!email.includes("@")) {
        throw new Error("Please enter a valid email");
      }

      const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || "Registration failed");
      }

      const data = await response.json();
      const { access, refresh } = data;

      // Get user profile
      const profileRes = await fetch("http://127.0.0.1:8000/api/users/profile/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      if (!profileRes.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const userData = await profileRes.json();

      localStorage.setItem("refresh", refresh);
      login(access, userData);

      setSuccess("Account created successfully");
      
      setTimeout(() => {
        if (userData.role === "admin") {
          navigate("/admin");
        } else if (userData.role === "seller") {
          navigate("/seller");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <section className="container section">
      <div className="checkout-box">
        <h2>Register</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form className="checkout-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="filter-select"
          >
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
          </select>

          <button type="submit" className="btn btn-dark">
            Register
          </button>
        </form>

        <p style={{ marginTop: "16px" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;