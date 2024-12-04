import React, { useState, useEffect } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BreadCrumb from "../../components/Other/BreadCrumb";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google"; // Import GoogleLogin
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userToken");
    if (isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

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

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    let validationErrors = {};

    // Kiểm tra xác thực
    if (!firstName) validationErrors.firstName = "Tên là bắt buộc";
    if (!lastName) validationErrors.lastName = "Họ là bắt buộc";
    if (!email) validationErrors.email = "Email là bắt buộc";
    if (!password) validationErrors.password = "Mật khẩu là bắt buộc";
    if (!confirmPassword)
      validationErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (password && !passwordRegex.test(password)) {
      validationErrors.password =
        "Mật khẩu phải ít nhất 8 ký tự, chứa ít nhất một chữ hoa, một chữ thường và một chữ số.";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      validationErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Hiển thị toast cho mỗi lỗi xác thực
      Object.values(validationErrors).forEach((error) =>
        showToast(error, "error")
      );
      setTimeout(() => {
        setErrors({});
      }, 4000);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/api/users/register",
        {
          username: `${firstName} ${lastName}`,
          email,
          password,
        }
      );

      if (response.status === 200) {
        showToast(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản của bạn.",
          "success"
        );
        setTimeout(() => navigate("/login"), 4000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrors({ form: error.response.data });
        showToast(error.response.data, "error");
      } else {
        setErrors({ form: "Có lỗi xảy ra. Vui lòng thử lại." });
        showToast("Có lỗi xảy ra. Vui lòng thử lại.", "error");
      }
      setTimeout(() => {
        setErrors({});
      }, 4000);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = async (response) => {
    const { credential } = response;
    try {
      const res = await axios.post(
        "http://localhost:8081/api/users/google-login",
        { tokenId: credential }
      );

      if (res.data.token) {
        localStorage.setItem("userToken", res.data.token);
        showToast("Đăng ký với Google thành công!", "success");
        window.location.reload();
        navigate("/");
      }
    } catch (error) {
      showToast("Đăng ký với Google thất bại!", "error");
    }
  };

  // Handle Google login failure
  const handleGoogleFailure = (error) => {
    console.error("Google Login Error:", error);
    showToast("Không thể đăng ký bằng Google!", "error");
  };

  return (
    <>
      <ToastContainer />
      <BreadCrumb title="Đăng ký" />
      <div className="register-wrapper-container">
        <div data-aos="fade-up" className="register-wrapper shadow-lg">
          <h2 className="text-center fs-3 mb-4">Đăng ký</h2>
          <form className="register-form" onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                Họ
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                placeholder="Nhập tên của bạn"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && (
                <p className="text-danger">{errors.firstName}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Tên
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                placeholder="Nhập họ của bạn"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && (
                <p className="text-danger">{errors.lastName}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Địa chỉ email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-danger">{errors.email}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Mật khẩu
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-danger">{errors.password}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="text-danger">{errors.confirmPassword}</p>
              )}
            </div>

            {errors.form && <p className="text-danger">{errors.form}</p>}

            <button
              type="submit"
              className="btn btn-primary w-100 mb-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>{" "}
                  Đang tải...
                </>
              ) : (
                "Đăng ký"
              )}
            </button>

            <div className="text-center mb-4">
              <p>
                Đã có tài khoản?{" "}
                <Link to="/login" className="login-link">
                  Đăng nhập tại đây
                </Link>
              </p>
            </div>

            <div className="d-flex justify-content-between gap-15">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
                theme="filled_blue"
                shape="circle"
                width="250px"
              >
                <FaGoogle className="fs-5 me-3" /> Đăng nhập với Google
              </GoogleLogin>
              <button className="btn btn-primary w-50 mb-2">
                <FaFacebook className="fs-5 me-2" /> Đăng nhập với Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
