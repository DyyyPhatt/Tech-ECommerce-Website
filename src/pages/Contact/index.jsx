import React, { useState, useEffect } from "react";
import "./Contact.css";
import { Link } from "react-router-dom";
import { fetchContactData } from "../../api/contactApi";
import BreadCrumb from "../../components/Other/BreadCrumb";
import LoadingSpinner from "../../components/Other/LoadingSpinner";
import { FaHome, FaPhoneAlt, FaRegCalendarAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [contactData, setContactData] = useState({
    address: { street: "", communes: "", district: "", city: "", country: "" },
    phone_number: [],
    email: [],
    timeServing: "",
    googleMap: "",
  });
  const [loading, setLoading] = useState(true);
  const [hasShownError, setHasShownError] = useState(false);

  useEffect(() => {
    loadContactData();
  }, [hasShownError]);

  const loadContactData = async () => {
    try {
      const data = await fetchContactData();
      setContactData(data);
      setHasShownError(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu liên hệ:", error);
      if (!hasShownError) {
        toast.error("Không thể lấy dữ liệu liên hệ. Vui lòng thử lại!", {
          autoClose: 5000,
        });
        setHasShownError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <ToastContainer />
      <BreadCrumb title="Liên Hệ" />
      <div className="contact-wrapper py-4 home-wrapper-2">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* Google Map iframe */}
              <iframe
                src={contactData.googleMap}
                width="450"
                height="450"
                className="border-0 w-100"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div data-aos="fade-up" className="col-12 mt-5">
              <div className="contact-inner-wrapper d-flex justify-content-between">
                {/* Mục Liên Hệ */}
                <div className="col-lg-6 col-md-12 mb-4">
                  <h3 className="contact-title mb-4">Liên Hệ</h3>
                  <form className="d-flex flex-column gap-15">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập tên của bạn"
                    />
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Nhập email của bạn *"
                    />
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Nhập số điện thoại của bạn"
                    />
                    <textarea
                      className="w-100 form-control"
                      cols={30}
                      rows={5}
                      placeholder="Nhập ý kiến của bạn"
                    ></textarea>
                    <Link to="/" className="button fs-5">
                      Gửi
                    </Link>
                  </form>
                </div>

                {/* Mục Thông Tin Liên Hệ */}
                <div className="col-lg-6 col-md-12">
                  <h3 className="contact-title mb-4">Liên Hệ với chúng tôi</h3>
                  <ul className="ps-0">
                    <li className="mb-3 d-flex gap-15 align-items-center">
                      <FaHome className="fs-3" />
                      <address className="mb-0">
                        Địa chỉ:{" "}
                        {`${contactData.address.street}, ${contactData.address.communes}, ${contactData.address.district}, ${contactData.address.city}, ${contactData.address.country}`}
                      </address>
                    </li>
                    <li className="mb-3 d-flex gap-15 align-items-center">
                      <FaPhoneAlt className="fs-5" />
                      <span>
                        Số điện thoại: {contactData.phone_number.join("/ ")}
                      </span>
                    </li>
                    {contactData.email.map((email, index) => (
                      <li
                        key={index}
                        className="mb-3 d-flex gap-15 align-items-center"
                      >
                        <MdEmail className="fs-5" />
                        <span>
                          Email {index + 1}: {email}
                        </span>
                      </li>
                    ))}
                    <li className="mb-3 d-flex gap-15 align-items-center">
                      <FaRegCalendarAlt className="fs-5" />
                      <span>{contactData.timeServing}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
