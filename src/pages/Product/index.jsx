import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ReactImageMagnify from "react-image-magnify";
import "./ProductDetails.css";
import {
  fetchProducts,
  fetchProductDetails,
  fetchProductReviews,
} from "../../api/productApi";
import { fetchBrandById } from "../../api/brandApi";
import { fetchCategoryById } from "../../api/categoryApi";
import { fetchTagsByIds } from "../../api/tagApi";
import { fetchProductConditionById } from "../../api/productConditionApi";
import BreadCrumb from "../../components/Other/BreadCrumb";
import ReactStars from "react-rating-stars-component";
import ProductCard from "../../components/ProductCard";
import CartContext from "../../components/Context/CartContext";
import FavoritesContext from "../../components/Context/FavoritesContext";
import LoadingSpinner from "../../components/Other/LoadingSpinner";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  const { productName } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  const [loading, setLoading] = useState(true);

  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const { addToCart } = useContext(CartContext);

  // State cho phân trang
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [currentQAPage, setCurrentQAPage] = useState(1);
  const reviewsPerPage = 5;
  const qaPerPage = 3;

  // Các câu hỏi & trả lời tĩnh
  const qaItems = [
    {
      question: "Sản phẩm này có bảo hành không?",
      answer: "Có, sản phẩm này có bảo hành 1 năm.",
    },
    {
      question: "Sản phẩm này có bảo hành không?",
      answer: "Có, sản phẩm này có bảo hành 1 năm.",
    },
    {
      question: "Sản phẩm này có bảo hành không?",
      answer: "Có, sản phẩm này có bảo hành 1 năm.",
    },
    {
      question: "Sản phẩm này có bảo hành không?",
      answer: "Có, sản phẩm này có bảo hành 1 năm.",
    },
    {
      question: "Sản phẩm này có bảo hành không?",
      answer: "Có, sản phẩm này có bảo hành 1 năm.",
    },
  ];

  // Tính toán chỉ số cho đánh giá
  const indexOfLastReview = currentReviewPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // Tính toán chỉ số cho Q&A
  const indexOfLastQA = currentQAPage * qaPerPage;
  const indexOfFirstQA = indexOfLastQA - qaPerPage;
  const currentQA = qaItems.slice(indexOfFirstQA, indexOfLastQA);

  const paginateReviews = (pageNumber) => setCurrentReviewPage(pageNumber);
  const paginateQA = (pageNumber) => setCurrentQAPage(pageNumber);

  const fetchUserById = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/users/${userId}`
      );
      if (response.data && response.data.username) {
        return response.data;
      } else {
        return { username: "Người dùng ẩn danh" };
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
      return {};
    }
  };

  useEffect(() => {
    const loadProductDetails = async () => {
      if (!productName) {
        console.warn("Tên sản phẩm trống. Không thể tải chi tiết sản phẩm.");
        return;
      }

      try {
        const productData = await fetchProductDetails(productName);
        if (productData && productData.length > 0) {
          const product = productData[0];
          setProduct(product);

          setMainImage(product.mainImage);
          setSelectedColor(
            product.colors && product.colors.length > 0
              ? product.colors[0]?.name
              : "default-color"
          );

          const brand = await fetchBrandById(product.brand);
          const category = await fetchCategoryById(product.category);
          const condition = await fetchProductConditionById(product.condition);
          const tags = await fetchTagsByIds(product.tags);

          setProduct((prev) => ({
            ...prev,
            brandName: brand.brandName,
            categoryName: category.cateName,
            conditionName: condition.conditionName,
            tags: tags.map((tag) => tag.name),
          }));

          loadProducts(category.id);
        } else {
          throw new Error("Không tìm thấy sản phẩm với tên đã cho.");
        }
      } catch (error) {
        toast.error("Lỗi khi tải chi tiết sản phẩm.");
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadProducts = async (categoryId) => {
      setLoading(true);
      try {
        const productsData = await fetchProducts("newest", categoryId);
        const limitedProducts = productsData.slice(0, 8);
        const productsWithDetails = await Promise.all(
          limitedProducts.map(async (product) => {
            const brand = await fetchBrandById(product.brand);
            const condition = await fetchProductConditionById(
              product.condition
            );
            return {
              ...product,
              brandName: brand.brandName,
              conditionName: condition.conditionName,
            };
          })
        );
        setProducts(productsWithDetails);
      } catch (error) {
        toast.error("Lỗi khi tải sản phẩm.");
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [productName]);

  useEffect(() => {
    if (product) {
      const loadProductReviews = async () => {
        try {
          const reviewsData = await fetchProductReviews(product.id);
          const reviewsWithUserDetails = await Promise.all(
            reviewsData.map(async (review) => {
              const userDetails = await fetchUserById(review.user);
              return {
                ...review,
                userName: userDetails.username,
              };
            })
          );

          setReviews(reviewsWithUserDetails);
        } catch (error) {
          toast.error("Lỗi khi tải đánh giá sản phẩm.");
          console.error("Lỗi khi tải đánh giá sản phẩm:", error);
        }
      };

      loadProductReviews();
    }
  }, [product]);

  console.log(reviews);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    const maxQuantity =
      product.colors.find((color) => color.name === selectedColor)?.quantity ||
      0;

    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const isLiked = favorites.some((item) => item.id === product?.id);

  const handleToggleLike = () => {
    if (!product) return;
    toggleFavorite(product);
    toast[isLiked ? "info" : "success"](
      isLiked
        ? "Sản phẩm đã được gỡ khỏi yêu thích."
        : "Sản phẩm đã được thêm vào yêu thích!"
    );
  };

  const handleAddToCart = () => {
    if (product && selectedColor) {
      addToCart(product, selectedColor, quantity);
      toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
    }
  };

  if (loading) return <LoadingSpinner />;

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";
  };

  return (
    <>
      <ToastContainer />
      <BreadCrumb title={`Cửa hàng / ${product.productName}`} />
      <div className="product-details-container">
        <div className="product-details-wrapper">
          <div className="product-images-section">
            <div className="main-image-container">
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: "Sản phẩm",
                    isFluidWidth: true,
                    src: mainImage,
                  },
                  largeImage: {
                    src: mainImage,
                    width: 1200,
                    height: 1200,
                  },
                  enlargedImagePosition: "over",
                }}
              />
            </div>
            <div className="thumbnail-images">
              <img
                src={product.mainImage}
                className="thumbnail-image img-fluid"
                alt="Sản phẩm chính"
                onClick={() => setMainImage(product.mainImage)}
              />
              {product.thumbnails.map((thumb, index) => (
                <img
                  key={index}
                  src={thumb}
                  className="thumbnail-image img-fluid"
                  alt={`Ảnh thu nhỏ ${index + 1}`}
                  onClick={() => setMainImage(thumb)}
                />
              ))}
            </div>
          </div>

          <div className="product-details-content">
            <h1 className="product-title">{product.productName}</h1>
            <p className="product-brand">Thương hiệu: {product.brandName}</p>
            <p className="product-category">Danh mục: {product.categoryName}</p>
            <p className="product-condition">
              Tình trạng: {product.conditionName}
            </p>
            <p className="product-tags">
              Thẻ:{" "}
              {product.tags.length > 0 ? product.tags.join(", ") : "Không có"}
            </p>
            <p className="product-quantity">
              Sẵn có:{" "}
              {Array.isArray(product.colors) && selectedColor
                ? product.colors.find((c) => c.name === selectedColor)
                    ?.quantity || 0
                : 0}{" "}
              sản phẩm
            </p>

            <div className="rating-section">
              <ReactStars
                count={5}
                value={product.ratings.average}
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

            <div className="product-description">
              <h2 className="description-title">Mô tả sản phẩm</h2>
              <p className="description-text">{product.productDesc}</p>
            </div>

            <div className="color-selection">
              <p className="color-title">Chọn màu:</p>
              <div className="color-options">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`color-option ${
                      selectedColor === color.name ? "active" : ""
                    }`}
                    onClick={() => handleColorChange(color.name)}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="quantity-and-cart">
              <div className="quantity-section">
                <p className="quantity-title">Số lượng:</p>
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="quantity-button"
                    onClick={incrementQuantity}
                    disabled={
                      quantity >=
                      (product.colors.find(
                        (color) => color.name === selectedColor
                      )?.quantity || 0)
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Kiểm tra nếu số lượng màu được chọn là 0 */}
              {product.colors.find((color) => color.name === selectedColor)
                ?.quantity > 0 ? (
                <Link
                  to="#"
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </Link>
              ) : (
                <button className="add-to-cart-button out-of-stock" disabled>
                  Hết hàng
                </button>
              )}

              <Link
                to="#"
                onClick={handleToggleLike}
                className="wishlist-button"
              >
                {isLiked ? (
                  <FaHeart
                    className="icon heart-icon fs-1"
                    style={{ color: "red" }}
                  />
                ) : (
                  <FaRegHeart className="icon heart-icon fs-1" />
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "specs" ? "active" : ""}`}
              onClick={() => setActiveTab("specs")}
            >
              Thông số kỹ thuật
            </button>
            <button
              className={`tab ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh giá
            </button>
            <button
              className={`tab ${activeTab === "qa" ? "active" : ""}`}
              onClick={() => setActiveTab("qa")}
            >
              Hỏi & Đáp
            </button>
          </div>

          {/* Nội dung của các tab */}
          <div className="tab-content">
            {activeTab === "specs" && product && (
              <div className="specifications">
                <h2>Thông số kỹ thuật sản phẩm</h2>
                <ul>
                  {Object.entries(product.specifications).map(
                    ([title, info]) => (
                      <li key={title}>
                        <strong>
                          {title.charAt(0).toUpperCase() + title.slice(1)}:
                        </strong>{" "}
                        {info}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="reviews">
                <h2>Đánh giá của khách hàng</h2>
                {currentReviews.length > 0 ? (
                  currentReviews.map((review, index) => (
                    <div key={index} className="review-item">
                      <ReactStars
                        count={5}
                        value={review.rating}
                        size={24}
                        isHalf={true}
                        edit={false}
                        emptyIcon={<i className="far fa-star"></i>}
                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                        fullIcon={<i className="fa fa-star"></i>}
                        activeColor="#ffd700"
                      />
                      <p>
                        <strong>
                          {review.userName || "Người dùng ẩn danh"}
                        </strong>
                        : "{review.comment}"
                      </p>
                      <p>
                        <small>
                          Được đăng vào{" "}
                          {format(parseISO(review.createdAt), "MMMM dd, yyyy")}
                        </small>
                      </p>
                    </div>
                  ))
                ) : (
                  <p>Chưa có đánh giá nào.</p>
                )}
                {/* Phân trang cho Đánh giá */}
                <div className="pagination">
                  {Array.from(
                    { length: Math.ceil(reviews.length / reviewsPerPage) },
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => paginateReviews(index + 1)}
                        className={
                          currentReviewPage === index + 1 ? "active-page" : ""
                        }
                      >
                        {index + 1}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
            {activeTab === "qa" && (
              <div className="qa-section">
                <h2>Hỏi & Đáp</h2>
                {currentQA.length > 0 ? (
                  currentQA.map((qaItem, index) => (
                    <div key={index} className="qa-item">
                      <p>
                        <strong>Q: {qaItem.question}</strong>
                      </p>
                      <p>
                        <strong>A:</strong> {qaItem.answer}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>Chưa có câu hỏi nào.</p>
                )}
                {/* Phân trang cho Hỏi & Đáp */}
                <div className="pagination">
                  {Array.from(
                    { length: Math.ceil(qaItems.length / qaPerPage) },
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => paginateQA(index + 1)}
                        className={
                          currentQAPage === index + 1 ? "active-page" : ""
                        }
                      >
                        {index + 1}
                      </button>
                    )
                  )}
                </div>
                {/* Form Hỏi & Đáp */}
                <div className="qa-form">
                  <h3>Hỏi một câu hỏi</h3>
                  <form>
                    <textarea
                      placeholder="Gõ câu hỏi của bạn ở đây..."
                      required
                      className="qa-textarea"
                    ></textarea>
                    <button type="submit" className="qa-submit-button">
                      Gửi câu hỏi
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newest Collection Section */}
      <section className="product-wrapper home-wrapper-2 py-5">
        <div data-aos="fade-up" className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-heading">Sản Phẩm Mới Nhất</div>
              <div className="row mt-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    colSize="col-lg-3 col-md-6 col-sm-6 col-12"
                    product={{
                      ...product,
                      brand: product.brandName,
                      condition: product.conditionName,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
