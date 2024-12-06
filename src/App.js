import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Layout from "./components/Other/Layout";
import Home from "./pages/Home/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Store from "./pages/Store";
import Blog from "./pages/Blog/Blog";
import Wishlist from "./pages/Other/Wishlist";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import ResetPassword from "./pages/Authentication/ResetPassword";
import WarrantyPolicy from "./pages/Policies/WarrantyPolicy";
import ShippingPolicy from "./pages/Policies/ShippingPolicy";
import PrivacyPolicy from "./pages/Policies/PrivacyPolicy";
import PaymentPolicy from "./pages/Policies/PaymentPolicy";
import SearchResults from "./pages/Search";
import Forum from "./pages/Forum";
import ProductDetails from "./pages/Product";
import BlogDetails from "./pages/Blog/BlogDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AOS from "aos";
import "aos/dist/aos.css";
import EditProfile from "./pages/Other/EditProfile";
import OrderHistory from "./pages/Other/OrderHistory";
import ProductList from "./pages/Other/ProductList";
import NotFound from "./components/Other/404Page";
import { FavoritesProvider } from "./components/Context/FavoritesContext";
import { CartProvider } from "./components/Context/CartContext";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <BrowserRouter>
        <CartProvider>
          <FavoritesProvider>
            {/* <ScrollToTop /> */}
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="store" element={<Store />} />
                <Route path="blogs" element={<Blog />} />
                <Route path="forum" element={<Forum />} />
                <Route path="favorite-wishlist" element={<Wishlist />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route
                  path="reset-password/:token"
                  element={<ResetPassword />}
                />
                <Route path="warranty-policy" element={<WarrantyPolicy />} />
                <Route path="shipping-policy" element={<ShippingPolicy />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="payment-policy" element={<PaymentPolicy />} />
                <Route
                  path="product/:productName"
                  element={<ProductDetails />}
                />
                <Route path="blog/:title" element={<BlogDetails />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="my-account" element={<EditProfile />} />
                <Route path="order-history" element={<OrderHistory />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/products" element={<ProductList />} />
              </Route>
            </Routes>
          </FavoritesProvider>
        </CartProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
