import React, { useEffect, useState } from "react";
import "./About.css";
import BreadCrumb from "../../components/Other/BreadCrumb";
import { Carousel } from "react-bootstrap";
import { fetchAboutData } from "../../api/aboutApi";
import FeatureCard from "../../components/Other/FeatureCard";
import CreatorProfile from "../../components/Other/CreatorProfile";
import LoadingSpinner from "../../components/Other/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiSettings,
  FiShield,
  FiHelpCircle,
  FiZap,
  FiTrendingUp,
} from "react-icons/fi";

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      const data = await fetchAboutData();
      setAboutData(data);
      setCreators(data && data.length > 0 ? data[0].creator : []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error("Lỗi khi lấy dữ liệu giới thiệu: " + error);
      setError(null);
    }
  }, [error]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
      />

      <BreadCrumb title="Giới Thiệu" />
      <AboutSection aboutData={aboutData} />
      <FeatureSection />
      <CreatorsSection creators={creators} />
    </>
  );
};

// About Section component
const AboutSection = ({ aboutData }) => (
  <section data-aos="fade-up" className="bg-light px-4 py-5 font-sans">
    <div className="container">
      <div className="row">
        <div className="col-lg-12 mb-5">
          <Carousel>
            {aboutData &&
              aboutData.map((about) =>
                about.image.map((img, imgIndex) => (
                  <Carousel.Item key={imgIndex}>
                    <img
                      className="d-block w-100"
                      src={img}
                      alt={`Slide ${imgIndex + 1}`}
                    />
                  </Carousel.Item>
                ))
              )}
          </Carousel>
        </div>
        <div className="col-lg-12">
          {aboutData && (
            <>
              <h2 className="text-dark fs-4 fw-bold mb-4">
                {aboutData[0].title}
              </h2>
              <div
                className="policy-content"
                dangerouslySetInnerHTML={{ __html: aboutData[0].content }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  </section>
);

// Feature Section component
const FeatureSection = () => {
  const features = [
    {
      icon: <FiSettings size={50} />,
      title: "Tùy Chỉnh",
      content:
        "Tùy chỉnh sản phẩm của chúng tôi để phù hợp với nhu cầu của bạn. Mở rộng phạm vi tiếp cận với mạng lưới toàn cầu của chúng tôi.",
    },
    {
      icon: <FiShield size={50} />,
      title: "Bảo Mật",
      content:
        "Dữ liệu của bạn được bảo vệ bởi các biện pháp bảo mật mới nhất.",
    },
    {
      icon: <FiHelpCircle size={50} />,
      title: "Hỗ Trợ",
      content: "Hỗ trợ khách hàng 24/7 cho tất cả các thắc mắc của bạn.",
    },
    {
      icon: <FiZap size={50} />,
      title: "Hiệu Suất",
      content: "Trải nghiệm hiệu suất nhanh chóng với sản phẩm của chúng tôi.",
    },
    {
      icon: <FiTrendingUp size={50} />,
      title: "Khả Năng Mở Rộng",
      content:
        "Doanh nghiệp của bạn có thể phát triển dễ dàng nhờ vào cơ sở hạ tầng mở rộng của chúng tôi.",
    },
  ];

  return (
    <section data-aos="fade-up" className="bg-light px-4 py-5 font-sans">
      <div className="container">
        <h2 className="text-dark text-center fs-3 fw-bold mb-5">
          Khám Phá Các Tính Năng Đặc Biệt Của Chúng Tôi
        </h2>
        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 g-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              content={feature.content}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Creators Section component
const CreatorsSection = ({ creators }) => (
  <section data-aos="fade-up" className="about-creators bg-light px-4 py-5">
    <div className="container">
      <h2 className="text-dark text-center fs-3 fw-bold mb-4">
        Các Nhà Sáng Lập
      </h2>
      <div className="row">
        {creators.map((creator, index) => (
          <CreatorProfile key={index} creator={creator} />
        ))}
      </div>
    </div>
  </section>
);

export default About;
