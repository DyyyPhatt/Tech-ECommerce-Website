import React, { useState, useEffect } from "react";
import BreadCrumb from "../../components/Other/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaHistory,
} from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    address: {
      street: "",
      communes: "",
      district: "",
      city: "",
      country: "",
    },
    createdAt: "",
    updatedAt: "",
    avatar: "",
  });

  const showToast = (message, type = "info") => {
    if (type === "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else if (type === "error") {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("userToken");

    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      axios
        .get(`http://localhost:8081/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Lỗi khi tải thông tin người dùng:", error);
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username" || name.startsWith("address.")) {
      if (value.length > 50) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Giới hạn tối đa là 50 ký tự.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }

    if (name === "phone_number") {
      setUser((prev) => ({
        ...prev,
        phone_number: value,
      }));

      if (value.length !== 10 && value.length !== 11) {
        setErrors((prev) => ({
          ...prev,
          phone_number: "Số điện thoại phải có 10 hoặc 11 chữ số.",
        }));
      } else if (/[^0-9]/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          phone_number: "Số điện thoại chỉ được chứa chữ số.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          phone_number: "",
        }));
      }
    }

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Định dạng email không hợp lệ",
      }));
    }

    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setUser((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("cartItems");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      showToast("Vui lòng sửa các lỗi trước khi cập nhật.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:8081/api/users/update/${user.id}`,
        user,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        showToast("Cập nhật thông tin thành công!", "success");
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          showToast(data || "Lỗi khi cập nhật thông tin.", "error");
        } else {
          showToast(data || "Có lỗi xảy ra, vui lòng thử lại sau.", "error");
        }
      } else {
        showToast("Không thể kết nối đến máy chủ. Vui lòng thử lại.", "error");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <BreadCrumb title="Chỉnh sửa hồ sơ" />
      <div className="bg-gradient p-4 align-items-center justify-content-center home-wrapper-2">
        <div data-aos="fade-up" className="row g-4">
          <div className="col-md-4 d-flex flex-column align-items-center">
            <div className="position-relative mb-4">
              <img
                src={user.avatar}
                alt="Hồ sơ người dùng"
                className="w-100 h-100 rounded-circle shadow-lg"
                style={{ maxWidth: "150px", maxHeight: "150px" }}
              />
              <label
                htmlFor="image-upload"
                className="position-absolute bottom-0 end-0 bg-white rounded-circle p-2 shadow-md cursor-pointer"
              >
                <FaEdit className="text-primary" />
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="d-none"
                />
              </label>
            </div>
            <p className="small text-muted">
              Nhấn vào biểu tượng chỉnh sửa để thay đổi ảnh đại diện của bạn
            </p>
          </div>

          <div className="col-md-8">
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <label htmlFor="username" className="form-label">
                  Tên người dùng
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    aria-label="Tên người dùng"
                    aria-invalid={errors.username ? "true" : "false"}
                  />
                </div>
                {errors.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    aria-label="Email"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby="email-error"
                  />
                </div>
                {errors.email && (
                  <div id="email-error" className="invalid-feedback">
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="phone" className="form-label">
                  Số điện thoại
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaPhone />
                  </span>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={user.phone_number}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.phone_number ? "is-invalid" : ""
                    }`}
                    aria-label="Số điện thoại"
                    aria-invalid={errors.phone_number ? "true" : "false"}
                    aria-describedby="phone-error"
                  />
                </div>
                {errors.phone_number && (
                  <div id="phone-error" className="invalid-feedback">
                    {errors.phone_number}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="password" className="form-label">
                  Mật khẩu
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    aria-label="Mật khẩu"
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby="password-error"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="input-group-text"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <div id="password-error" className="invalid-feedback">
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="col-12">
                <label htmlFor="address" className="form-label">
                  Địa chỉ
                </label>
                <div className="row g-2">
                  <div className="col-6">
                    <div className="input-group mb-2">
                      <span className="input-group-text">
                        <FaMapMarkerAlt />
                      </span>
                      <input
                        type="text"
                        id="street"
                        name="address.street"
                        value={user.address.street}
                        onChange={handleChange}
                        placeholder="Đường"
                        className={`form-control ${
                          errors["address.street"] ? "is-invalid" : ""
                        }`}
                        aria-label="Địa chỉ đường"
                      />
                    </div>
                    {errors["address.street"] && (
                      <div className="invalid-feedback">
                        {errors["address.street"]}
                      </div>
                    )}
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      name="address.communes"
                      value={user.address.communes}
                      onChange={handleChange}
                      placeholder="Xã"
                      className={`form-control ${
                        errors["address.communes"] ? "is-invalid" : ""
                      }`}
                      aria-label="Xã"
                    />
                    {errors["address.communes"] && (
                      <div className="invalid-feedback">
                        {errors["address.communes"]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="text"
                      name="address.district"
                      value={user.address.district}
                      onChange={handleChange}
                      placeholder="Quận"
                      className={`form-control ${
                        errors["address.district"] ? "is-invalid" : ""
                      }`}
                      aria-label="Quận"
                    />
                    {errors["address.district"] && (
                      <div className="invalid-feedback">
                        {errors["address.district"]}
                      </div>
                    )}
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      name="address.city"
                      value={user.address.city}
                      onChange={handleChange}
                      placeholder="Thành phố"
                      className={`form-control ${
                        errors["address.city"] ? "is-invalid" : ""
                      }`}
                      aria-label="Thành phố"
                    />
                    {errors["address.city"] && (
                      <div className="invalid-feedback">
                        {errors["address.city"]}
                      </div>
                    )}
                  </div>
                </div>
                <input
                  type="text"
                  name="address.country"
                  value={user.address.country}
                  onChange={handleChange}
                  placeholder="Quốc gia"
                  className={`form-control mt-2 ${
                    errors["address.country"] ? "is-invalid" : ""
                  }`}
                  aria-label="Quốc gia"
                />
                {errors["address.country"] && (
                  <div className="invalid-feedback">
                    {errors["address.country"]}
                  </div>
                )}
              </div>

              <div className="col-6">
                <label htmlFor="createdAt" className="form-label">
                  Ngày tạo
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaCalendarAlt />
                  </span>
                  <input
                    type="text"
                    id="created_at"
                    value={new Date(user.createdAt).toLocaleDateString()}
                    className="form-control"
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
                <label htmlFor="updatedAt" className="form-label">
                  Ngày cập nhật
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaCalendarAlt />
                  </span>
                  <input
                    type="text"
                    id="updated_at"
                    value={new Date(user.updatedAt).toLocaleDateString()}
                    className="form-control"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-evenly mt-5">
          <Link to="/" onClick={handleLogout}>
            <button className="btn btn-danger w-100 mb-3" type="button">
              <IoLogOutOutline className="fs-4 me-2" />
              Đăng xuất
            </button>
          </Link>

          <Link to="#">
            <button
              onClick={handleSubmit}
              className="btn btn-primary w-100 mb-3"
              type="button"
            >
              <FaSave className="fs-5 me-3" />
              Lưu thay đổi
            </button>
          </Link>

          <Link to="/order-history">
            <button className="btn btn-info w-100 mb-3" type="button">
              <FaHistory className="fs-5 me-3" />
              Lịch sử đơn hàng
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
