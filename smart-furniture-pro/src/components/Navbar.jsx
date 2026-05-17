import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { WishlistContext } from "../context/WishlistContext";

function Navbar({ theme, toggleTheme }) {

  const { cartCount } = useContext(CartContext);
  const { wishlistCount } = useContext(WishlistContext);
  const { user, userRole, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header className="navbar">

      <div className="container nav-wrapper">

        {/* LOGO */}
        <Link to="/" className="logo">
          <img
            src="/logo.png"
            alt="logo"
            style={{
              width: "60px",
              height: "60px",
              objectFit: "contain",
              marginRight: "8px",
            }}
          />
          Smart Furniture
        </Link>

        {/* NAV LINKS */}
        <nav className="nav-links">

          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/wishlist">Wishlist ({wishlistCount})</NavLink>
          <NavLink to="/cart">Cart ({cartCount})</NavLink>

          {isAuthenticated && <NavLink to="/my-orders">My Orders</NavLink>}
          {userRole === "seller" && <NavLink to="/seller">Seller</NavLink>}
          {userRole === "admin" && <NavLink to="/admin">Admin</NavLink>}


          {!isAuthenticated ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          ) : (
            <button
              onClick={logout}
              className="btn btn-light logout-btn"
            >
              Logout
            </button>
          )}

        </nav>
      </div>

      {isAuthenticated && user && (
        <div className="container user-info">
          <p>
            Logged in as: <strong>{user.username}</strong> ({user.role})
          </p>
        </div>
      )}

    </header>
  );
}

export default Navbar;