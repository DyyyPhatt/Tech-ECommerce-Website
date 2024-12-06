import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../components/Other/BreadCrumb";
import CartItem from "../../components/Other/CartItem";
import LoadingSpinner from "../../components/Other/LoadingSpinner";
import CartContext from "../../components/Context/CartContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
  const { cartItems } = useContext(CartContext);
  const isLoggedIn = !!localStorage.getItem("userToken");
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchProductPrice = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/products/${productId}`
      );
      return response.data.discountPrice;
    } catch (error) {
      console.error("Không thể lấy giá sản phẩm:", error);
      return 0;
    }
  };

  const calculateTotalPrice = async () => {
    let total = 0;

    for (let product of cartItems) {
      let price = parseFloat(product.discountPrice);

      if (isNaN(price)) {
        price = await fetchProductPrice(product.id);
      }

      const quantity = parseInt(product.quantity) || 0;
      total += price * quantity;
    }

    return total;
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchTotalPrice = async () => {
      const price = await calculateTotalPrice();
      setTotalPrice(price);
    };

    fetchTotalPrice();
  }, [cartItems]);

  const handleBackToStore = () => {
    navigate("/store");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm!");
      return;
    }
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (!cartItems) return <LoadingSpinner />;

  return (
    <>
      <ToastContainer />
      <BreadCrumb title="Giỏ Hàng" />
      <section className="cart-wrapper home-wrapper-2 py-3">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="cart-header py-3 justify-content-between d-flex align-items-center">
                <h4 className="cart-col-1">Sản phẩm</h4>
                <h4 className="cart-col-2">Màu sắc</h4>
                <h4 className="cart-col-3">Số lượng</h4>
                <h4 className="cart-col-4">Giá</h4>
                <h4 className="cart-col-5">Xóa</h4>
              </div>
            </div>

            {cartItems.length > 0 ? (
              cartItems.map((product) => (
                <CartItem
                  key={`${product.id}-${product.selectedColor}`}
                  product={product}
                />
              ))
            ) : (
              <div className="empty-cart text-center mt-4 mb-4 fs-6">
                Giỏ hàng của bạn đang trống.
              </div>
            )}

            <div className="col-12 d-flex justify-content-between gap-15 mt-3">
              <button
                className="btn btn-outline-primary"
                onClick={handleBackToStore}
              >
                <FaArrowLeft /> Quay lại cửa hàng
              </button>
              <div className="total-amount">
                <h4>Tổng cộng: {totalPrice.toLocaleString()}₫</h4>
              </div>
              <button className="btn btn-primary" onClick={handleCheckout}>
                Tiến hành thanh toán <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
