import React, { useState, useEffect } from "react";
import "./Home.css";
import { BiChevronRight } from "react-icons/bi";
import { fetchCategories } from "../../api/categoryApi";
import { fetchBrands, fetchBrandById } from "../../api/brandApi";
import { fetchProductConditionById } from "../../api/productConditionApi";
import { fetchAdvertisements } from "../../api/advertisementApi";
import { fetchLatestBlogs } from "../../api/blogsApi";
import {
  fetchProducts,
  fetchSpecialProducts,
  fetchDiscountedProducts,
} from "../../api/productApi";

import Slider from "react-slick";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import BlogCard from "../../components/BlogCard";
import ProductCard from "../../components/ProductCard";
import SpecialProduct from "../../components/SpecialProduct";
import FeatureCard from "../../components/Other/FeatureCard";
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

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const [col, setCol] = useState("col-lg-3 col-md-6 col-sm-6 col-12");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [specialProducts, setSpecialProducts] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        setCategories(await fetchCategories());
        setBrands(await fetchBrands());
        setAdvertisements(await fetchAdvertisements());
        setLatestBlogs(await fetchLatestBlogs());

        const addBrandAndConditionNames = async (products) => {
          return await Promise.all(
            products.map(async (product) => {
              const brand = await fetchBrandById(product.brand);
              const condition = await fetchProductConditionById(
                product.condition
              );
              return {
                ...product,
                brandName: brand.brandName,
                conditionName: condition.conditionName,
              };
            })
          );
        };

        const productsWithDetails = await addBrandAndConditionNames(
          await fetchProducts()
        );
        const specialProductsWithDetails = await addBrandAndConditionNames(
          await fetchSpecialProducts()
        );
        const discountedProductsWithDetails = await addBrandAndConditionNames(
          await fetchDiscountedProducts()
        );

        setProducts(productsWithDetails.slice(0, 8));
        setSpecialProducts(specialProductsWithDetails.slice(0, 6));
        setDiscountProducts(discountedProductsWithDetails.slice(0, 8));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Unable to fetch data. Please try again!", {
          autoClose: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mainAdv = advertisements.length > 0 ? advertisements[0].mainAdv : [];
  const allSubAdv = advertisements.reduce((acc, adv) => {
    return acc.concat(adv.subAdv);
  }, []);
  const subAdv =
    advertisements.length > 0 ? advertisements[0].subAdv.slice(-4) : [];

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <ToastContainer />
      <section className="home-wrapper-1 py-5">
        <div data-aos="fade-up" className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="main-banner">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <Slider {...settings}>
                    {mainAdv.map((adv, index) => (
                      <div key={index}>
                        <img
                          src={adv.image}
                          className="img-fluid rounded-3"
                          alt={`main banner ${index + 1}`}
                        />
                      </div>
                    ))}
                  </Slider>
                )}
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="small-banner-container d-flex flex-wrap justify-content-between align-items-center">
                {subAdv.map((adv, index) => (
                  <div key={index} className="small-banner col-6 mb-2">
                    <img
                      src={adv.image}
                      className="img-fluid rounded-3"
                      alt={`sub banner ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-light px-4 py-5 font-sans">
        <div data-aos="fade-up" className="container">
          <h2 className="text-dark text-center fs-3 fw-bold mb-5">
            Khám Phá Các Tính Năng Đặc Biệt Của Chúng Tôi
          </h2>
          <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 g-4">
            <FeatureCard
              icon={<FiSettings size={50} />}
              title="Tùy Chỉnh"
              content="Tùy chỉnh sản phẩm của chúng tôi để phù hợp với nhu cầu của bạn. Mở rộng phạm vi tiếp cận với mạng lưới toàn cầu của chúng tôi."
            />
            <FeatureCard
              icon={<FiShield size={50} />}
              title="Bảo Mật"
              content="Dữ liệu của bạn được bảo vệ bởi các biện pháp bảo mật mới nhất."
            />
            <FeatureCard
              icon={<FiHelpCircle size={50} />}
              title="Hỗ Trợ"
              content="Hỗ trợ khách hàng 24/7 cho tất cả các thắc mắc của bạn."
            />
            <FeatureCard
              icon={<FiZap size={50} />}
              title="Hiệu Suất"
              content="Trải nghiệm hiệu suất nhanh chóng với sản phẩm của chúng tôi."
            />
            <FeatureCard
              icon={<FiTrendingUp size={50} />}
              title="Khả Năng Mở Rộng"
              content="Doanh nghiệp của bạn có thể phát triển dễ dàng nhờ vào cơ sở hạ tầng mở rộng của chúng tôi."
            />
          </div>
        </div>
      </section>
      <section className="product-wrapper home-wrapper-2 py-5">
        <div data-aos="fade-up" className="container">
          <div className="row">
            <div className="col-12">
              <div className="col-12 d-flex justify-content-between align-items-center">
                <div className="section-heading">Sản Phẩm Giảm Giá</div>
                <Link to="/products?type=discounted" className="view-all-link">
                  Xem tất cả <BiChevronRight />
                </Link>
              </div>
              <div className="row mt-3">
                {discountProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    colSize={col}
                    product={{
                      ...product,
                      brand: product.brandName,
                      condition: product.conditionName,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5">
        <div data-aos="fade-up" className="container">
          <div className="row">
            <div className="col-12">
              <div className="categories d-flex flex-wrap align-items-center">
                {categories.map((category) => (
                  <div
                    className="category-item col-lg-3 col-md-4 col-sm-6 col-12"
                    key={category._id}
                  >
                    <Link
                      className="category-item d-flex gap-5 justify-content-evenly align-items-center"
                      to={`/store?categoryId=${category.id}`}
                    >
                      <div>
                        <h6>{category.cateName}</h6>
                      </div>
                      <img src={category.cateImage} alt={category.cateName} />{" "}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="product-wrapper home-wrapper-2 py-5">
        <div data-aos="fade-up" className="container">
          <div className="row">
            <div className="col-12">
              <div className="col-12 d-flex justify-content-between align-items-center">
                <div className="section-heading">Sản Phẩm Mới Nhất</div>
                <Link to="/products?type=newest" className="view-all-link">
                  Xem tất cả <BiChevronRight />
                </Link>
              </div>
              <div className="row mt-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    colSize={col}
                    product={{
                      ...product,
                      brand: product.brandName,
                      condition: product.conditionName,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="marquee-wrapper py-5">
        <div data-aos="fade-up" className="container">
          <div className="row">
            <div className="col-12">
              <div className="marquee-inner-wrapper">
                <Marquee className="d-flex">
                  {brands.map((brand, index) => (
                    <div className="brand-wrapper mx-4" key={index}>
                      <Link to={`/store?brandId=${brand.id}`}>
                        {" "}
                        <img
                          src={brand.brandImage}
                          alt={brand.name}
                          className="brand-image"
                        />
                      </Link>
                    </div>
                  ))}
                </Marquee>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="special-wrapper py-4">
        <div data-aos="fade-up" className="container">
          <div className="row">
            <div className="col-12">
              <div className="col-12 d-flex justify-content-between align-items-center">
                <div className="section-heading">Sản Phẩm Đánh Giá Cao</div>
                <Link to="/products?type=special" className="view-all-link">
                  Xem tất cả <BiChevronRight />
                </Link>
              </div>
              <div className="row mt-3">
                {specialProducts.map((specialProduct) => (
                  <SpecialProduct
                    key={specialProduct.id}
                    colSize="col-lg-4 col-md-6 col-sm-6 col-12"
                    product={{
                      ...specialProduct,
                      brand: specialProduct.brandName,
                      condition: specialProduct.conditionName,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="blog-wrapper home-wrapper-2 py-5">
        <div data-aos="fade-up" className="container">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div className="section-heading">Tin Tức Mới Nhất</div>
              <Link to="/blogs" className="view-all-link">
                Xem tất cả <BiChevronRight />
              </Link>
            </div>
            <div className="row mt-3">
              {latestBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} colSize={col} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="marquee-wrapper py-5">
        <div data-aos="fade-up" className="container">
          <div className="row">
            <div className="col-12">
              <div className="marquee-inner-wrapper">
                <Marquee className="d-flex">
                  {allSubAdv.map((adv, index) => (
                    <div className="adv-wrapper mx-4" key={index}>
                      <Link to="#">
                        <img
                          src={adv.image}
                          alt={adv.description}
                          className="adv-image"
                        />
                      </Link>
                    </div>
                  ))}
                </Marquee>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
