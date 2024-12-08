import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import BreadCrumb from "../../components/Other/BreadCrumb";
import ReactStars from "react-rating-stars-component";
import LoadingSpinner from "../../components/Other/LoadingSpinner";
import { FaSort, FaChevronDown, FaChevronUp, FaUndo } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderHistoryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userToken = localStorage.getItem("userToken");
  const decodedToken = jwtDecode(userToken);
  const userId = decodedToken.id;

  const ordersPerPage = 5;

  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/products/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching product details for ID: ${productId}`,
        error
      );
      return null;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchOrdersWithProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/orders/user/${userId}`
        );
        const ordersData = response.data;

        const ordersWithProducts = await Promise.all(
          ordersData.map(async (order) => {
            const updatedItems = await Promise.all(
              order.items.map(async (item) => {
                const productDetails = await fetchProductDetails(item.product);
                return {
                  ...item,
                  productName: productDetails?.productName || "Không xác định",
                  productImage: productDetails?.mainImage || "placeholder.jpg",
                  hasReviewed: item.hasReviewed || false,
                };
              })
            );
            return { ...order, items: updatedItems };
          })
        );

        setOrders(ordersWithProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setLoading(false);
        toast.error("Không thể lấy danh sách đơn hàng.");
      }
    };

    fetchOrdersWithProductDetails();
  }, [userId]);

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.orderCreatedAt) - new Date(a.orderCreatedAt);
    } else if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  const filteredOrders = sortedOrders.filter(
    (order) => filterStatus === "all" || order.status === filterStatus
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleOpenReviewModal = (product) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setRating(5);
    setComment("");
  };

  const handleSubmitReview = async () => {
    try {
      const payload = {
        user: userId,
        product: selectedProduct.product,
        rating,
        comment,
      };

      const response = await axios.post(
        "http://localhost:8081/api/reviews/add",
        payload,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Đánh giá của bạn đã được gửi thành công!");
        await updateHasReviewedStatus(selectedProduct.product);
        handleCloseReviewModal();
      } else {
        toast.error("Không thể gửi đánh giá. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Có lỗi xảy ra khi gửi đánh giá.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateHasReviewedStatus = async (productId) => {
    try {
      await axios.put(
        `http://localhost:8081/api/orders/update-hasReviewed/${expandedOrder}/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          items: order.items.map((item) =>
            item.product === productId ? { ...item, hasReviewed: true } : item
          ),
        }))
      );
    } catch (error) {
      console.error("Error updating review status:", error);
      toast.error("Không thể cập nhật trạng thái đánh giá.");
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const formatCurrency = (amount) => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫`;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <ToastContainer />
      <BreadCrumb title="Lịch sử Đơn Hàng" />
      <div className="edit-profile-wrapper home-wrapper-2 py-4">
        <div data-aos="fade-up" className="container">
          <div className="d-flex justify-content-between mb-4">
            <button
              onClick={() => setSortBy("date")}
              className="btn btn-primary me-2"
            >
              <FaSort className="me-1" />
              Sắp xếp theo Ngày
            </button>
            <button
              onClick={() => setSortBy("status")}
              className="btn btn-primary"
            >
              <FaSort className="me-1" />
              Sắp xếp theo Trạng Thái
            </button>
            <select
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select w-auto ms-2"
            >
              <option value="all">Tất cả Trạng Thái</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đang vận chuyển">Đang vận chuyển</option>
              <option value="Đã giao hàng">Đã giao hàng</option>
            </select>
          </div>

          <div className="card">
            <div className="card-body">
              {filteredOrders.length === 0 ? (
                <div className="text-center p-4">
                  <h4 className="mb-3">Không có đơn hàng nào để hiển thị.</h4>
                  <p className="text-muted fs-6">
                    Bạn chưa thực hiện thanh toán đơn hàng nào. Hãy tiếp tục mua
                    sắm!
                  </p>
                  <div className="mt-4">
                    <Link to="/shop" className="btn btn-primary">
                      Đi đến cửa hàng
                    </Link>
                  </div>
                </div>
              ) : (
                currentOrders.map((order) => (
                  <div key={order.id} className="border-bottom">
                    <div
                      className="d-flex justify-content-between align-items-center p-3"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <div>
                        <h5 className="mb-1">Đơn hàng #{order.id}</h5>
                        <p className="mb-0 text-muted">
                          {new Date(order.orderCreatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`badge ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                        {expandedOrder === order.id ? (
                          <FaChevronUp className="ms-3" />
                        ) : (
                          <FaChevronDown className="ms-3" />
                        )}
                      </div>
                    </div>
                    {expandedOrder === order.id && (
                      <div className="p-3 bg-light">
                        <h4 className="mb-3">Danh sách sản phẩm</h4>
                        <div className="row">
                          {order.items.map((item, index) => (
                            <div key={index} className="col-md-4 mb-3 d-flex">
                              <Link to={`/product/${item.productName}`}>
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="img-thumbnail me-3"
                                  style={{
                                    width: "120px",
                                    height: "120px",
                                    objectFit: "contain",
                                  }}
                                />
                              </Link>

                              <div>
                                <h6>{item.productName}</h6>
                                <p className="mb-2">Màu sắc: {item.color}</p>
                                <p className="mb-2">
                                  Số lượng: {item.quantity}
                                </p>
                                <p>Giá: {formatCurrency(item.priceTotal)}</p>
                                {order.status === "Đã giao hàng" &&
                                  !item.hasReviewed && (
                                    <button
                                      className="btn btn-primary btn-sm mt-2"
                                      onClick={() =>
                                        handleOpenReviewModal(item)
                                      }
                                    >
                                      Đánh giá sản phẩm
                                    </button>
                                  )}
                                {order.status === "Đã giao hàng" &&
                                  item.hasReviewed && (
                                    <button
                                      className="btn btn-secondary btn-sm mt-2"
                                      disabled
                                    >
                                      Đã đánh giá
                                    </button>
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3">
                          <h4 className="mb-3">Thông tin đơn hàng</h4>

                          <p>
                            <strong>Người nhận:</strong> {order.fullName}
                          </p>
                          <p>
                            <strong>Số điện thoại:</strong> {order.phoneNumber}
                          </p>
                          {order.notes && (
                            <p>
                              <strong>Ghi chú:</strong> {order.notes}
                            </p>
                          )}
                        </div>
                        <div className="mt-3">
                          <p>
                            <strong>Địa chỉ giao hàng:</strong>{" "}
                            {order.shippingAddress ? (
                              [
                                order.shippingAddress.street,
                                order.shippingAddress.communes,
                                order.shippingAddress.district,
                                order.shippingAddress.city,
                                order.shippingAddress.country,
                              ]
                                .filter(Boolean)
                                .join(", ")
                            ) : (
                              <span>Chưa có địa chỉ</span>
                            )}
                          </p>
                        </div>
                        <div className="mt-3">
                          <p>
                            <strong>Phương thức thanh toán:</strong>{" "}
                            {order.paymentMethod}
                          </p>
                          <p>
                            <strong>Phí giao hàng:</strong>{" "}
                            {formatCurrency(order.shippingCost)}
                          </p>
                          {order.coupon && (
                            <>
                              <p>
                                <strong>Mã giảm giá:</strong> {order.coupon}
                              </p>
                              <p>
                                <strong>Số tiền giảm giá:</strong>{" "}
                                {formatCurrency(order.couponDiscount)}
                              </p>
                            </>
                          )}
                          <p>
                            <strong>Tổng tiền:</strong>{" "}
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div className="d-flex justify-content-center mt-4">
                {Array.from(
                  { length: Math.ceil(filteredOrders.length / ordersPerPage) },
                  (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`btn ${
                        currentPage === i + 1
                          ? "btn-primary"
                          : "btn-outline-primary"
                      } mx-1`}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReviewModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Đánh giá sản phẩm</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseReviewModal}
                ></button>
              </div>
              <div className="modal-body p-4">
                {/* Thông tin sản phẩm */}
                <div className="text-center mb-4">
                  <img
                    src={selectedProduct.productImage}
                    alt={selectedProduct.productName}
                    className="img-fluid rounded mb-3 shadow"
                    style={{ maxWidth: "150px" }}
                  />
                  <h6 className="fw-bold">{selectedProduct.productName}</h6>
                </div>

                {/* Đánh giá sao */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Chọn đánh giá
                  </label>
                  <ReactStars
                    count={5}
                    value={rating}
                    size={36}
                    isHalf={true}
                    onChange={handleRatingChange}
                    emptyIcon={<i className="far fa-star"></i>}
                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                    fullIcon={<i className="fa fa-star"></i>}
                    activeColor="#ffd700"
                  />
                </div>

                {/* Nhập nhận xét */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Nhận xét</label>
                  <textarea
                    className="form-control shadow-sm"
                    rows="4"
                    placeholder="Hãy để lại nhận xét của bạn..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>

                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-primary px-4 py-2 shadow"
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "Đang xử lý":
      return "bg-warning text-dark";
    case "Đang vận chuyển":
      return "bg-info text-white";
    case "Đã giao hàng":
      return "bg-success text-white";
    default:
      return "bg-secondary text-white";
  }
};

export default OrderHistoryPage;
