import React, { useContext, useState } from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import AddToCartSelectionModal from "../Modal/AddToCartSelectionModal";
import { FaHeart, FaRegHeart, FaEye, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import FavoritesContext from "../Context/FavoritesContext";
import CartContext from "../Context/CartContext";

const ProductCard = ({ colSize, product }) => {
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || ""
  );
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const { addToCart } = useContext(CartContext);

  const isLiked = favorites.some((item) => item.id === product.id);

  const handleToggleLike = () => {
    toggleFavorite(product);
    toast.success(
      isLiked
        ? "Sản phẩm đã bị xóa khỏi yêu thích."
        : "Sản phẩm đã được thêm vào yêu thích!"
    );
  };

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedQuantity);
    toast.success("Sản phẩm đã được thêm vào giỏ hàng.");
    setShowSelectionModal(false);
  };

  const totalQuantity = product.colors.reduce(
    (total, color) => total + color.quantity,
    0
  );

  const formatCurrency = (amount) => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫`;
  };

  const roundToHalf = (num) => {
    if (num > Math.floor(num) && num < Math.floor(num) + 1) {
      return Math.floor(num) + 0.5;
    }
    return Math.round(num);
  };

  return (
    <div className={colSize}>
      <div className="product-card">
        <div className="icon-wrapper">
          <Link to="#" onClick={handleToggleLike}>
            {isLiked ? (
              <FaHeart className="icon heart-icon" style={{ color: "red" }} />
            ) : (
              <FaRegHeart className="icon heart-icon" />
            )}
          </Link>
          <Link to={`/product/${product.productName}`}>
            <FaEye className="icon eye-icon" />
          </Link>
          <Link
            to="#"
            onClick={() => totalQuantity > 0 && setShowSelectionModal(true)}
          >
            <FaShoppingCart
              className={`icon cart-icon ${
                totalQuantity === 0 ? "disabled-icon" : ""
              }`}
              title={totalQuantity === 0 ? "Hết hàng" : ""}
            />
          </Link>
        </div>

        <div className="product-image">
          <Link to={`/product/${product.productName}`}>
            <img
              src={product.mainImage}
              className="img-fluid first-image"
              alt={product.productName}
            />
            {product.thumbnails && product.thumbnails.length > 0 && (
              <img
                src={product.thumbnails[0]}
                className="img-fluid second-image"
                alt={`${product.productName} thumbnail`}
              />
            )}
          </Link>
        </div>

        <div className="product-details">
          <h6 className="brand">{product.brandName}</h6>
          <Link to={`/product/${product.productName}`}>
            <h5 className="product-title">{product.productName}</h5>
          </Link>
          <p className="product-condition mb-1 text-muted">
            Tình trạng: {product.conditionName}
          </p>
          <p className="product-quantity">Số lượng: {totalQuantity} sản phẩm</p>

          <div className="rating-section">
            <ReactStars
              count={5}
              value={roundToHalf(product.ratings.average)}
              size={28}
              isHalf={true}
              edit={false}
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
              activeColor="#ffd700"
            />
            <p className="review-count mb-0">
              ({product.ratings.totalReviews})
            </p>
          </div>

          <div className="price-section">
            <p className="product-price mb-0 mt-1">
              {formatCurrency(product.discountPrice)}
            </p>
            {product.price && (
              <p className="original-price mb-0 mt-1">
                {formatCurrency(product.price)}
              </p>
            )}
          </div>
        </div>
      </div>

      <AddToCartSelectionModal
        show={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        product={product}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
        handleConfirmAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default ProductCard;
