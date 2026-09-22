import { Routes, Route } from "react-router-dom";

// Website Pages
import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";
import Collections from "../pages/Collections/Collections";
import ProductDetails from "../pages/Product/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import OrderSuccess from "../pages/Orders/OrderSuccess";
import NewArrivals from "../pages/NewArrivals/NewArrivals";
import BestSellers from "../pages/BestSellers/BestSellers";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Wishlist from "../pages/Wishlist/Wishlist";
import NotFound from "../pages/NotFound/NotFound";

// Authentication Pages
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ForgotPassword from "../features/auth/pages/ForgotPassword";

// Layout
import WebsiteLayout from "./layout/WebsiteLayout";
import ProtectedSellerRoute from "./ProtectedSellerRoute";
import SellerDashboard from "../pages/Seller/SellerDashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* Website */}
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/best-sellers" element={<BestSellers />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route element={<ProtectedSellerRoute />}>
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default AppRoutes;
