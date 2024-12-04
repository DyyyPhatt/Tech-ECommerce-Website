import React, { useState } from "react";
import "./ResetPassword.css";
import BreadCrumb from "../../components/Other/BreadCrumb";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất một chữ cái viết hoa, một chữ cái viết thường và một chữ số."
      );
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8081/api/users/reset-password/${token}`,
        { newPassword: password }
      );
      toast.success("Mật khẩu đã được đặt lại thành công!");

      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <BreadCrumb title="Đặt lại mật khẩu" />
      <div className="reset-password-wrapper-container">
        <div data-aos="fade-up" className="reset-password-wrapper shadow-lg">
          <h2 className="text-center fs-3 mb-4">Đặt lại mật khẩu</h2>
          <form className="reset-password-form" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Mật khẩu mới
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Xác nhận mật khẩu của bạn"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                "Đặt lại mật khẩu"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
