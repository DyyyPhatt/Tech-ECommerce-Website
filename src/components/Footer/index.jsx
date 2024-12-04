import React from "react";
import "./Footer.css";
import { Link, useNavigate } from "react-router-dom";
import {
  BsLinkedin,
  BsGithub,
  BsYoutube,
  BsInstagram,
  BsFacebook,
} from "react-icons/bs";
import newsletter from "../../assets/images/newsletter.png";

const Footer = () => {
  const isLoggedIn = !!localStorage.getItem("userToken");
  const navigate = useNavigate();

  const handleProtectedNavigation = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {/* Newsletter Section */}
      <footer className="py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-5">
              <div className="footer-top-data d-flex gap-30 align-items-center">
                <img src={newsletter} alt="newsletter" />
                <h4 className="text-white mb-0">Đăng ký nhận bản tin</h4>
              </div>
            </div>
            <div className="col-md-7">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control py-2"
                  placeholder="Nhập địa chỉ email của bạn"
                  aria-label="Nhập địa chỉ email của bạn"
                  aria-describedby="basic-addon2"
                />
                <span className="input-group-text p-2" id="basic-addon2">
                  <Link className="fs-6 text-black" to="/">
                    Đăng ký
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Information Section */}
      <footer className="py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-6 mb-3">
              <h4 className="text-white mb-4">Liên hệ với chúng tôi</h4>
              <div className="contact-links">
                <address className="text-white-50 py-2 mb-1 fs-7">
                  Địa chỉ: 01 Đường Võ Văn Ngân, Phường Linh Chiểu, <br /> TP.
                  Thủ Đức, TP.Hồ Chí Minh.
                </address>
                <Link className="text-white-50 py-2 mb-1">
                  Điện thoại: +84 28 3896 8641
                </Link>
                <br />
                <Link className="text-white-50 py-2 mb-1">
                  Email: 21110270@student.hcmute.edu.vn
                </Link>
                <br />
                <Link className="text-white-50 py-2 mb-1">
                  Email: 21110318@student.hcmute.edu.vn
                </Link>
                <div className="social-icons d-flex align-items-center gap-30 mt-4">
                  {[
                    { icon: <BsLinkedin className="fs-3" />, link: "/" },
                    { icon: <BsFacebook className="fs-3" />, link: "/" },
                    { icon: <BsInstagram className="fs-3" />, link: "/" },
                    { icon: <BsGithub className="fs-3" />, link: "/" },
                    { icon: <BsYoutube className="fs-3" />, link: "/" },
                  ].map(({ icon, link }, index) => (
                    <Link key={index} className="text-white" to={link}>
                      {icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Links Sections */}
            <div className="col-md-2 col-6 mb-3">
              <h4 className="text-white mb-4">Thông tin</h4>
              <div className="footer-links d-flex flex-column">
                {[
                  { label: "Cửa hàng", path: "/store" },
                  { label: "Tin tức", path: "/blogs" },
                  { label: "Diễn đàn", path: "/forum" },
                  { label: "Giới thiệu", path: "/about" },
                  { label: "Liên hệ", path: "/contact" },
                ].map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className="text-white-50 py-2 mb-1"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="col-md-2 col-6 mb-3">
              <h4 className="text-white mb-4">Tài khoản</h4>
              <div className="footer-links d-flex flex-column">
                {[
                  {
                    label: "Tài khoản của tôi",
                    path: "/my-account",
                    protected: true,
                  },
                  {
                    label: "Danh sách yêu thích",
                    path: "/favorite-wishlist",
                  },
                  {
                    label: "Đơn hàng của tôi",
                    path: "/order-history",
                    protected: true,
                  },
                  { label: "Giỏ hàng", path: "/cart" },
                ].map((item, index) => (
                  <Link
                    key={index}
                    to={item.protected ? "#" : item.path}
                    className="text-white-50 py-2 mb-1"
                    onClick={(e) => {
                      if (item.protected) {
                        e.preventDefault();
                        handleProtectedNavigation(item.path);
                      }
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="col-md-2 col-6 mb-3">
              <h4 className="text-white mb-4">Chính sách</h4>
              <div className="footer-links d-flex flex-column">
                {[
                  { label: "Chính sách bảo hành", path: "/warranty-policy" },
                  { label: "Chính sách vận chuyển", path: "/shipping-policy" },
                  { label: "Chính sách bảo mật", path: "/privacy-policy" },
                  { label: "Chính sách thanh toán", path: "/payment-policy" },
                ].map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className="text-white-50 py-2 mb-1"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Bottom Section */}
      <footer className="py-3">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center text-white-50 mb-0">
                © {new Date().getFullYear()} Đào Duy Phát & Trần Thị Á Tiên -
                Tiểu luận chuyên ngành - Khoa Công nghệ Thông tin, Trường Đại
                Học Sư Phạm Kỹ Thuật TPHCM.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
