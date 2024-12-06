import { React, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../../components/Other/BreadCrumb";
import { Modal, Button } from "react-bootstrap";
import {
  FaSpinner,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    notes: "",
    streetAddress: "",
    commune: "",
    district: "",
    city: "",
    country: "Việt Nam",
    paymentMethod: "",
    provinceCode: "",
    districtCode: "",
    coupon: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [discountCodes, setDiscountCodes] = useState([]);
  const navigate = useNavigate();

  // States for provinces, districts, and communes
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://provinces.open-api.vn/api/?depth=1"
        );
        setProvinces(response.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (formData.city) {
        try {
          const response = await axios.get(
            `https://provinces.open-api.vn/api/p/${formData.provinceCode}?depth=2`
          );
          setDistricts(response.data.districts);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    };
    fetchDistricts();
  }, [formData.provinceCode]);

  useEffect(() => {
    const fetchCommunes = async () => {
      if (formData.district) {
        try {
          const response = await axios.get(
            `https://provinces.open-api.vn/api/d/${formData.districtCode}?depth=2`
          );
          setCommunes(response.data.wards);
        } catch (error) {
          console.error("Error fetching communes:", error);
        }
      }
    };
    fetchCommunes();
  }, [formData.districtCode]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCoupons = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/coupons/active"
        );
        setDiscountCodes(response.data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };
    fetchCoupons();
  }, []);

  const handleCloseModal = () => {
    if (isSuccess) {
      navigate("/order-history");
    }
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case "commune":
        newErrors.commune = value.trim() === "" ? "Xã/Phường là bắt buộc" : "";
        break;
      case "fullName":
        newErrors.fullName = value.trim() === "" ? "Họ tên là bắt buộc" : "";
        break;
      case "phoneNumber":
        newErrors.phoneNumber = /^\d{10}$/.test(value)
          ? ""
          : "Số điện thoại không hợp lệ";
        break;
      case "streetAddress":
        newErrors.streetAddress =
          value.trim() === "" ? "Địa chỉ là bắt buộc" : "";
        break;
      case "district":
        newErrors.district =
          value.trim() === "" ? "Quận/Huyện là bắt buộc" : "";
        break;
      case "city":
        newErrors.city = value.trim() === "" ? "Thành phố là bắt buộc" : "";
        break;
      case "country":
        newErrors.country = value.trim() === "" ? "Quốc gia là bắt buộc" : "";
        break;
      case "paymentMethod":
        newErrors.paymentMethod =
          value === "" ? "Vui lòng chọn phương thức thanh toán" : "";
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (key === "coupon") return;

      validateField(key, formData[key]);
      if (!formData[key] && key !== "notes") {
        newErrors[key] = `${key} là bắt buộc`;
        formIsValid = false;
      }
    });

    setErrors(newErrors);
    return formIsValid;
  };

  console.log(formData.coupon);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formIsValid = validateForm();
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const userToken = localStorage.getItem("userToken");
    const decodedToken = jwtDecode(userToken);
    const userId = decodedToken.id;

    if (formIsValid) {
      setIsLoading(true);

      const orderData = {
        user: userId,
        items: cartItems.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          color: product.selectedColor,
        })),
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        shippingAddress: {
          street: formData.streetAddress,
          communes: formData.commune,
          district: formData.district,
          city: formData.city,
          country: formData.country,
        },
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        coupon: formData.coupon,
      };

      try {
        const response = await axios.post(
          "http://localhost:8081/api/orders/customer/add",
          orderData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        await axios.put(
          `http://localhost:8081/api/cart/clear/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        localStorage.removeItem("cartItems");

        setIsLoading(false);
        setModalMessage("Đơn hàng đã được đặt hàng thành công!");
        setIsSuccess(true);
        setShowModal(true);
      } catch (error) {
        setIsLoading(false);
        setModalMessage("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
        setIsSuccess(false);
        setShowModal(true);
      }
    } else {
      setModalMessage("Vui lòng sửa các lỗi và thử lại.");
      setIsSuccess(false);
      setShowModal(true);
    }
  };

  const formatCurrency = (amount) => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫`;
  };

  return (
    <>
      <BreadCrumb title="Thanh toán" />
      <div
        data-aos="fade-up"
        className="d-flex align-items-center justify-content-center p-4 bg-light"
      >
        <div
          className="bg-white rounded shadow-lg p-5 w-100"
          style={{ maxWidth: "800px" }}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="row g-3">
              <div className="col-md-6 mb-3">
                <label htmlFor="fullName" className="form-label">
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`form-control ${
                    errors.fullName ? "is-invalid" : ""
                  }`}
                />
                {errors.fullName && (
                  <div className="invalid-feedback">{errors.fullName}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="phoneNumber" className="form-label">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`form-control ${
                    errors.phoneNumber ? "is-invalid" : ""
                  }`}
                />
                {errors.phoneNumber && (
                  <div className="invalid-feedback">{errors.phoneNumber}</div>
                )}
              </div>
            </div>

            {/* Notes field */}
            <div className="mb-3">
              <label htmlFor="notes" className="form-label">
                Ghi chú cho cửa hàng (Tùy chọn)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-control"
                rows="3"
              />
            </div>

            <div className="row g-3">
              <div className="col-md-4 mb-3">
                <label htmlFor="city" className="form-label">
                  Tỉnh/Thành phố
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    const selectedProvince = provinces.find(
                      (province) => province.name === selectedName
                    );

                    setFormData({
                      ...formData,
                      city: selectedName,
                      provinceCode: selectedProvince
                        ? selectedProvince.code
                        : "",
                    });
                  }}
                  className={`form-control ${errors.city ? "is-invalid" : ""}`}
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <div className="invalid-feedback">{errors.city}</div>
                )}
              </div>

              <div className="col-md-4 mb-3">
                <label htmlFor="district" className="form-label">
                  Quận/Huyện
                </label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    const selectedDistrict = districts.find(
                      (district) => district.name === selectedName
                    );

                    setFormData({
                      ...formData,
                      district: selectedName,
                      districtCode: selectedDistrict
                        ? selectedDistrict.code
                        : "",
                    });
                  }}
                  className={`form-control ${
                    errors.district ? "is-invalid" : ""
                  }`}
                  disabled={!formData.city} // Vô hiệu hóa nếu chưa chọn tỉnh/thành phố
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <div className="invalid-feedback">{errors.district}</div>
                )}
              </div>
              <div className="col-md-4">
                <label htmlFor="commune" className="form-label">
                  Xã/Phường
                </label>
                <select
                  id="commune"
                  name="commune"
                  value={formData.commune}
                  onChange={handleChange}
                  className={`form-control ${
                    errors.commune ? "is-invalid" : ""
                  }`}
                  disabled={!formData.district}
                >
                  <option value="">Chọn Xã/Phường</option>
                  {communes.map((commune) => (
                    <option key={commune.code} value={commune.name}>
                      {commune.name}
                    </option>
                  ))}
                </select>
                {errors.commune && (
                  <div className="invalid-feedback">{errors.commune}</div>
                )}
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6 mb-3">
                <label htmlFor="streetAddress" className="form-label">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className={`form-control ${
                    errors.streetAddress ? "is-invalid" : ""
                  }`}
                />
                {errors.streetAddress && (
                  <div className="invalid-feedback">{errors.streetAddress}</div>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="country" className="form-label">
                  Quốc gia
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`form-control ${
                    errors.country ? "is-invalid" : ""
                  }`}
                />
                {errors.country && (
                  <div className="invalid-feedback">{errors.country}</div>
                )}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="coupon" className="form-label">
                Mã giảm giá (Tùy chọn)
              </label>
              <select
                id="coupon"
                name="coupon"
                value={formData.coupon}
                onChange={handleChange}
                className={`form-control ${errors.coupon ? "is-invalid" : ""}`}
              >
                <option value="">Chọn mã giảm giá</option>
                {discountCodes.map((discount) => (
                  <option key={discount.code} value={discount.code}>
                    {discount.code} - {discount.description} - Giá trị đơn hàng
                    trên {formatCurrency(discount.minimumOrderAmount)} và giảm
                    tối đa {formatCurrency(discount.maxDiscountAmount)}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Payment Method</label>
              <div className="row">
                <div className="col-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange({
                        target: { name: "paymentMethod", value: "Credit Card" },
                      })
                    }
                    className={`btn btn-outline-primary p-3 w-100 ${
                      formData.paymentMethod === "Credit Card" ? "active" : ""
                    }`}
                  >
                    <FaCcVisa className="me-2" />
                    <FaCcMastercard />
                  </button>
                </div>
                <div className="col-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange({
                        target: { name: "paymentMethod", value: "PayPal" },
                      })
                    }
                    className={`btn btn-outline-primary p-3 w-100 ${
                      formData.paymentMethod === "PayPal" ? "active" : ""
                    }`}
                  >
                    <FaCcPaypal />
                  </button>
                </div>
                <div className="col-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange({
                        target: {
                          name: "paymentMethod",
                          value: "Thanh toán khi nhận hàng",
                        },
                      })
                    }
                    className={`btn btn-outline-primary p-3 w-100 ${
                      formData.paymentMethod === "Thanh toán khi nhận hàng"
                        ? "active"
                        : ""
                    }`}
                  >
                    COD
                  </button>
                </div>
              </div>
              {errors.paymentMethod && (
                <div className="text-danger mt-2">{errors.paymentMethod}</div>
              )}
            </div>
            <div className="d-flex justify-content-between justify-content-center mt-5">
              <Link to="/cart" className="btn btn-secondary">
                Back to Cart
              </Link>
              <button
                type="submit"
                className="btn btn-primary px-5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="spinner-border spinner-border-sm me-2" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Modal for success or failure messages */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className={`modal ${isSuccess ? "modal-success" : "modal-error"}`}
        centered
      >
        <Modal.Header closeButton className="border-0 pb-3">
          <Modal.Title className="d-flex align-items-center">
            {isSuccess ? (
              <FaCheckCircle className="modal-icon text-success me-2" />
            ) : (
              <FaTimesCircle className="modal-icon text-danger me-2" />
            )}
            <span className="fw-bold">Order Status</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center fs-5">{modalMessage}</Modal.Body>
        <Modal.Footer className="border-0 d-flex justify-content-center">
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            className={`btn ${
              isSuccess ? "btn-success" : "btn-danger"
            } rounded-pill px-4`}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CheckoutPage;
