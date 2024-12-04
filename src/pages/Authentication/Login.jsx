import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../../components/Other/BreadCrumb";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("Vui lòng nhập đầy đủ email và mật khẩu.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8081/api/users/login",
        { email, password }
      );

      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem("userToken", token);
        showToast("Đăng nhập thành công!", "success");
        window.location.reload();
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          showToast(data || "Email hoặc mật khẩu không chính xác.", "error");
        } else if (status === 403) {
          showToast(
            data ||
              "Tài khoản chưa được xác thực. Vui lòng kiểm tra email để kích hoạt tài khoản.",
            "error"
          );
        } else {
          showToast(data || "Có lỗi xảy ra, vui lòng thử lại sau.", "error");
        }
      } else {
        showToast("Không thể kết nối đến máy chủ. Vui lòng thử lại.", "error");
      }
    }
  };

  const handleGoogleSuccess = async (response) => {
    const { credential } = response;

    try {
      const res = await axios.post(
        "http://localhost:8081/api/users/google-login",
        {
          tokenId: credential,
        }
      );

      if (res.data.token) {
        localStorage.setItem("userToken", res.data.token);
        showToast("Đăng nhập với Google thành công!", "success");
        window.location.reload();
        navigate("/");
      }
    } catch (error) {
      showToast("Đăng nhập với Google thất bại!", "error");
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Error:", error);
    showToast("Không thể đăng nhập bằng Google!", "error");
  };

  return (
    <>
      <ToastContainer />
      <BreadCrumb title="Đăng nhập" />
      <div className="login-wrapper-container">
        <div data-aos="fade-up" className="login-wrapper shadow-lg">
          <h2 className="text-center fs-3 mb-4">Đăng nhập</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="mb-4">
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
            </div>

            {/* Password field */}
            <div className="mb-4">
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
            </div>

            {/* Remember me and Forgot password */}
            <div className="form-row d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Ghi nhớ tài khoản
                </label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 mb-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>{" "}
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>
          <div className="text-center mb-4">
            <p>
              Chưa có tài khoản?{" "}
              <Link to="/register" className="register-link">
                Đăng ký ngay
              </Link>
            </p>
          </div>
          <div className="d-flex gap-15">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              useOneTap
              theme="filled_blue"
              shape="circle"
              width="250px"
            ></GoogleLogin>

            {/* Facebook Login Placeholder */}
            <button className="btn btn-primary w-50 mb-2">
              <FaFacebook className="fs-5 me-2" /> Đăng nhập với Facebook
            </button>
          </div>
          {/* Google Login */}
        </div>
      </div>
    </>
  );
};

export default Login;
