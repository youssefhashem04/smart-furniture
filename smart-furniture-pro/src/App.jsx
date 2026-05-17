import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import SellerAddProduct from "./pages/SellerAddProduct";
import SellerOrders from "./pages/SellerOrders";
import AdminOrders from "./pages/AdminOrders";
import SellerManageProducts from "./pages/SellerManageProducts";
import SellerEditProduct from "./pages/SellerEditProduct";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="my-orders" element={<MyOrders />} />
        <Route path="contact" element={<Contact />} />
        <Route path="wishlist" element={<Wishlist />} />

        <Route
          path="seller"
          element={
            <ProtectedRoute allowedRole={["seller", "admin"]}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="seller/add-product"
          element={
            <ProtectedRoute allowedRole={["seller", "admin"]}>
              <SellerAddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="seller/manage-products"
          element={
            <ProtectedRoute allowedRole={["seller", "admin"]}>
              <SellerManageProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="seller/edit-product/:id"
          element={
            <ProtectedRoute allowedRole={["seller", "admin"]}>
              <SellerEditProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="seller/orders"
          element={
            <ProtectedRoute allowedRole={["seller", "admin"]}>
              <SellerOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/orders"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;