import React, { useState, useContext } from "react";
import "./SpecialProduct.css";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import AddToCartSelectionModal from "../Modal/AddToCartSelectionModal";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartContext from "../Context/CartContext";
import FavoritesContext from "../Context/FavoritesContext";

const SpecialProduct = ({ colSize, product }) => {
  const [mainImage, setMainImage] = useState(product.mainImage);
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || ""
  );
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
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
    const maxQuantity =
      product.colors.find((color) => color.name === selectedColor)?.quantity ||
      0;

    if (selectedQuantity > maxQuantity) {
      toast.error("Số lượng vượt quá giới hạn cho phép!");
      return;
    }

    addToCart(product, selectedColor, selectedQuantity);
    setShowModal(false);
    toast.success("Sản phẩm đã được thêm vào giỏ hàng.");
  };

  const formatCurrency = (amount) => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫`;
  };

  return (
    <div className={colSize}>
      <div className="special-product-card">
        <div className="d-flex justify-content-between">
          <div className="product-image-wrapper">
            <div className="main-image-container">
              <Link to={`/product/${product.productName}`}>
                <img
                  src={mainImage}
                  className="main-image img-fluid"
                  alt={product.productName}
                />
              </Link>
              <div className="icon-wrapper">
                <Link to="#" onClick={handleToggleLike}>
                  {isLiked ? (
                    <FaHeart
                      className="icon heart-icon"
                      style={{ color: "red" }}
                    />
                  ) : (
                    <FaRegHeart className="icon heart-icon" />
                  )}
                </Link>
              </div>
            </div>
            <div className="sub-images">
              {product.thumbnails.slice(0, 3).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  className="sub-image img-fluid"
                  alt={`Hình sản phẩm phụ ${index + 1}`}
                  onClick={() => setMainImage(image)}
                />
              ))}
            </div>
          </div>

          <div className="special-product-content">
            <h6 className="brand">{product.brandName}</h6>
            <Link to={`/product/${product.productName}`}>
              <h5 className="product-title">{product.productName}</h5>
            </Link>
            <p className="product-condition mb-1 text-muted">
              Tình trạng: {product.conditionName}
            </p>
            <p className="product-quantity">
              Số lượng:{" "}
              {Array.isArray(product.colors) && product.colors.length > 0
                ? product.colors.reduce((total, c) => total + c.quantity, 0)
                : 0}{" "}
              sản phẩm
            </p>

            <div className="rating-section">
              <ReactStars
                count={5}
                value={product.ratings.average}
                size={22}
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

            <Link to="#" className="button" onClick={() => setShowModal(true)}>
              Thêm vào giỏ
            </Link>
          </div>
        </div>

        <AddToCartSelectionModal
          show={showModal}
          onClose={() => setShowModal(false)}
          product={product}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedQuantity={selectedQuantity}
          setSelectedQuantity={setSelectedQuantity}
          handleConfirmAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default SpecialProduct;
