import React, { useState } from "react";
import "./ForgotPassword.css";
import { Link } from "react-router-dom";
import BreadCrumb from "../../components/Other/BreadCrumb";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8081/api/users/forgot-password",
        { email }
      );
      showToast(response.data, "success");
    } catch (error) {
      if (error.response) {
        showToast(error.response.data, "error");
      } else {
        showToast("Đã có lỗi xảy ra. Vui lòng thử lại.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <BreadCrumb title="Quên Mật Khẩu" />
      <div className="forgot-password-wrapper-container">
        <div data-aos="fade-up" className="forgot-password-wrapper shadow-lg">
          <h2 className="text-center fs-3 mb-4">Quên Mật Khẩu</h2>
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className="mb-4 text-center">
              <p>
                Nhớ mật khẩu?{" "}
                <Link to="/login" className="login-link">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="form-label">
                Địa chỉ email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Nhập địa chỉ email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
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
                "Quên Mật Khẩu"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
