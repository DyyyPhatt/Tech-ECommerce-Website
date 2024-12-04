import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import CartContext from "../Context/CartContext";
import ConfirmDeleteModal from "../Modal/ConfirmDeleteModal";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartItem = ({ product }) => {
  const { updateQuantity, updateColor, removeFromCart } =
    useContext(CartContext);
  const [quantity, setQuantity] = useState(product.quantity || 1);
  const [selectedColor, setSelectedColor] = useState(product.selectedColor);
  const [productDetails, setProductDetails] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const userToken = localStorage.getItem("userToken");

        if (userToken) {
          const decodedToken = jwtDecode(userToken);
          const userId = decodedToken.id;

          const cartResponse = await axios.get(
            `http://localhost:8081/api/cart/${userId}`
          );

          const cartProduct = cartResponse.data.items.find(
            (item) => item.product === product.id
          );

          if (cartProduct) {
            setQuantity(cartProduct.quantity);
            setSelectedColor(cartProduct.color);
          }
        } else {
          const localProduct = JSON.parse(
            localStorage.getItem("cartItems")
          )?.find((item) => item.id === product.id);

          if (localProduct) {
            setQuantity(localProduct.quantity);
            setSelectedColor(localProduct.selectedColor);
          }
        }

        // Fetch product details
        const response = await axios.get(
          `http://localhost:8081/api/products/${product.id}`
        );
        const productData = response.data;

        const brandResponse = await axios.get(
          `http://localhost:8081/api/brands/${productData.brand}`
        );
        const brand = brandResponse.data;

        const conditionResponse = await axios.get(
          `http://localhost:8081/api/product-conditions/${productData.condition}`
        );
        const condition = conditionResponse.data;

        setProductDetails({
          ...productData,
          brandName: brand.brandName,
          conditionName: condition.conditionName,
        });
      } catch (error) {
        console.error("Không thể lấy thông tin sản phẩm:", error);
      }
    };

    fetchProductDetails();
  }, [product.id]);

  const maxQuantity =
    productDetails?.colors?.find((color) => color.name === selectedColor)
      ?.quantity || 0;

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      updateQuantity(product.id, selectedColor, newQuantity);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(product.id, selectedColor, newQuantity);
    }
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;

    const newMaxQuantity =
      productDetails?.colors?.find((color) => color.name === newColor)
        ?.quantity || 0;

    if (newMaxQuantity === 0) {
      toast.error(
        `Màu "${newColor}" hiện không còn hàng. Vui lòng chọn màu khác!`
      );
      return;
    }

    setSelectedColor(newColor);
    updateColor(product.id, selectedColor, newColor, newMaxQuantity);

    const newQuantity = Math.min(quantity, newMaxQuantity);
    setQuantity(newQuantity);
  };

  const handleDelete = () => {
    setConfirmDeleteModal(true);
  };

  const confirmDelete = () => {
    removeFromCart(product.id, selectedColor);
    setConfirmDeleteModal(false);
  };

  return (
    <>
      <div className="cart-data py-4 justify-content-between d-flex align-items-center">
        <div className="cart-col-1 d-flex align-items-center">
          <div>
            {productDetails && (
              <Link to={`/product/${productDetails.productName}`}>
                <img src={productDetails.mainImage} alt="product" />
              </Link>
            )}
          </div>
          <div>
            {productDetails && (
              <>
                <Link to={`/product/${productDetails.productName}`}>
                  <h5 className="pro-title">{productDetails.productName}</h5>
                </Link>
                <p>Brand: {productDetails.brandName}</p>
                <p>Condition: {productDetails.conditionName}</p>
              </>
            )}
          </div>
        </div>
        <div className="cart-col-2">
          {productDetails && productDetails.colors && (
            <select
              value={selectedColor}
              onChange={handleColorChange}
              className="color-select"
            >
              {productDetails.colors.map((color, index) => (
                <option key={index} value={color.name}>
                  {color.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="cart-col-3 d-flex align-items-center justify-content-center">
          <button
            onClick={handleDecrement}
            className="quantity-button"
            disabled={quantity === 1}
          >
            -
          </button>
          <input
            type="text"
            value={quantity}
            readOnly
            className="quantity-input"
          />
          <button
            onClick={handleIncrement}
            className="quantity-button"
            disabled={quantity >= maxQuantity}
          >
            +
          </button>
        </div>
        <div className="price cart-col-4">
          {productDetails
            ? (productDetails.discountPrice * quantity).toLocaleString()
            : "Loading..."}
          ₫
        </div>
        <div className="cart-col-5 text-center">
          <button className="delete-button" onClick={handleDelete}>
            <FaTrash />
          </button>
        </div>
      </div>

      <ConfirmDeleteModal
        show={confirmDeleteModal}
        product={product}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteModal(false)}
      />
    </>
  );
};

export default CartItem;
