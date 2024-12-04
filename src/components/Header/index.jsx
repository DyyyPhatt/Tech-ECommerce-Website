import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Header.css";
import { fetchBrands } from "../../api/brandApi";
import { fetchCategories } from "../../api/categoryApi";
import { fetchProductConditions } from "../../api/productConditionApi";
import CartContext from "../Context/CartContext";
import ReactStars from "react-rating-stars-component";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import wishlist from "../../assets/images/wishlist.svg";
import user from "../../assets/images/user.svg";
import cart from "../../assets/images/cart.svg";
import menu from "../../assets/images/menu.svg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { cartInfo, addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("userToken");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Fetch Brands and Categories
  const fetchData = async () => {
    try {
      const [brandsData, categoriesData] = await Promise.all([
        fetchBrands(),
        fetchCategories(),
      ]);
      setBrands(brandsData);
      setCategories(categoriesData);
    } catch (error) {
      showErrorToast(`Lỗi khi tải dữ liệu: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format Currency
  const formatCurrency = (amount) => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫`;
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      try {
        const { data: products } = await axios.get(
          `http://localhost:8081/api/products/search?q=${value}`
        );

        const [brandsData, conditionsData] = await Promise.all([
          fetchBrands(),
          fetchProductConditions(),
        ]);

        const productsWithBrandNameAndCondition = products.map((product) => {
          const brand = brandsData.find((b) => b.id === product.brand);
          const condition = conditionsData.find(
            (c) => c.id === product.condition
          );
          return {
            ...product,
            brandName: brand ? brand.brandName : "Không xác định",
            conditionName: condition
              ? condition.conditionName
              : "Không xác định",
          };
        });

        setSuggestedProducts(productsWithBrandNameAndCondition);
        setIsDropdownVisible(true);
      } catch (error) {
        showErrorToast(`Lỗi khi tìm kiếm sản phẩm: ${error.message}`);
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      }
    } else {
      setSuggestedProducts([]);
      setIsDropdownVisible(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      setIsDropdownVisible(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleProductSelect = () => {
    setIsDropdownVisible(false);
    setSearchTerm("");
  };

  const renderSuggestedProducts = () => (
    <ul className="list-group position-absolute w-90 mt-1">
      {suggestedProducts.map((product) => (
        <Link
          to={`/product/${product.productName}`}
          onClick={handleProductSelect}
        >
          <li
            key={product.id}
            className="list-group-item d-flex align-items-center"
          >
            <img src={product.mainImage} alt={product.productName} />

            <div>
              <p className="mb-1 text-primary">{product.productName}</p>
              <p className="mb-1 text-muted">
                Thương hiệu: {product.brandName}
              </p>
              <p className="mb-1 text-muted">
                Tình trạng: {product.conditionName}
              </p>
              <div className="rating-section">
                <ReactStars
                  count={5}
                  value={product.ratings.average}
                  size={22}
                  isHalf={true}
                  edit={false}
                  emptyIcon={<i className="far fa-star"></i>}
                  halfIcon={<i className="fa fa-star-half-alt"></i>}
                  fullIcon={<i className="fa fa-star"></i>}
                  activeColor="#ffd700"
                />
                <p className="review-count mb-0">
                  ({product.ratings.totalReviews} đánh giá)
                </p>
              </div>
              <p className="mb-0 text-danger">
                Giảm giá: {formatCurrency(product.discountPrice)}
              </p>
            </div>
          </li>
        </Link>
      ))}
    </ul>
  );

  return (
    <>
      <header className="header-top-strip py-3">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <p className="text-white-50 mb-0">
                Chào mừng bạn đến với website của chúng tôi!
              </p>
            </div>
            <div className="col-6 text-end">
              <p className="phone-links text-white-50 mb-0">
                Hotline: <Link className="text-info">+84 865577xxx</Link> |{" "}
                <Link className="text-info">+84 123456xxx</Link>
              </p>
            </div>
          </div>
        </div>
      </header>

      <header className="header-upper py-3">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-2 col-md-2">
              <h2 className="mb-0">
                <Link className="text-warning" to="/">
                  PTTech
                </Link>
              </h2>
            </div>
            <div className="col-10 d-md-none text-end">
              <button className="menu-toggle-button" onClick={toggleMenu}>
                <FaBars className="text-white fs-3" />
              </button>
            </div>
            <div className="col-12 col-md-5 mt-3 mt-md-0 p-0 position-relative">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control py-2"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyPress}
                  aria-label="Tìm kiếm sản phẩm..."
                  aria-describedby="basic-addon2"
                />
                <span
                  className="input-group-text"
                  id="basic-addon2"
                  onClick={handleSearchSubmit}
                  style={{ cursor: "pointer" }}
                >
                  <BsSearch className="fs-5 text-black" />
                </span>
              </div>
              {isDropdownVisible &&
                suggestedProducts.length > 0 &&
                renderSuggestedProducts()}
            </div>

            <div className="col-6 col-md-5 d-none d-md-block">
              <div className="header-upper-links d-flex align-items-center justify-content-evenly">
                <Link
                  className="d-flex align-items-center gap-10 text-white-50"
                  to="/favorite-wishlist"
                >
                  <img src={wishlist} alt="favorite-wishlist" />
                  <p className="mb-0">
                    Danh sách <br /> yêu thích
                  </p>
                </Link>
                {isLoggedIn ? (
                  <Link
                    className="d-flex align-items-center gap-10 text-white-50"
                    to="/my-account"
                  >
                    <img src={user} alt="user-account" />
                    <p className="mb-0">
                      Tài khoản <br /> Cá nhân
                    </p>
                  </Link>
                ) : (
                  <Link
                    className="d-flex align-items-center gap-10 text-white-50"
                    to="/login"
                  >
                    <img src={user} alt="login" />
                    <p className="mb-0">
                      Đăng nhập <br /> Tài khoản
                    </p>
                  </Link>
                )}
                <Link
                  className="d-flex align-items-center gap-10 text-white-50"
                  to="/cart"
                >
                  <img src={cart} alt="cart" />
                  <div className="d-flex flex-column gap-1">
                    <span className="badge bg-danger text-white">
                      {cartInfo.totalQuantity}
                    </span>
                    <p className="mb-0">Giỏ hàng</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={`offcanvas-menu ${isMenuOpen ? "open" : ""}`}>
        <button className="close-menu" onClick={toggleMenu}>
          &times;
        </button>
        <div className="offcanvas-content">
          <Link to="/favorite-wishlist" className="offcanvas-link">
            <img src={wishlist} alt="wishlist" /> Danh sách yêu thích
          </Link>
          <Link to="/login" className="offcanvas-link">
            <img src={user} alt="user" /> Đăng nhập
          </Link>
          <Link to="/cart" className="offcanvas-link">
            <img src={cart} alt="cart" /> Giỏ hàng
          </Link>
          <NavLink to="/store" className="offcanvas-link">
            Cửa hàng
          </NavLink>
          <NavLink to="/blogs" className="offcanvas-link">
            Tin tức
          </NavLink>
          <NavLink to="/forum" className="offcanvas-link">
            Diễn đàn
          </NavLink>
          <NavLink to="/about" className="offcanvas-link">
            Về chúng tôi
          </NavLink>
          <NavLink to="/contact" className="offcanvas-link">
            Liên hệ
          </NavLink>
        </div>
      </div>

      <header className="header-bottom py-3 d-none d-md-block">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="menu-bottom d-flex justify-content-center align-items-center gap-20">
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle bg-transparent border-0 d-flex align-items-center"
                    type="button"
                    id="dropdownCategoriesBottom"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img src={menu} alt="menu" className="me-3" />
                    <span className="me-4 d-inline-block">Danh mục</span>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-dark p-0"
                    aria-labelledby="dropdownCategoriesBottom"
                  >
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          className="dropdown-item text-white"
                          to={`/store?categoryId=${category.id}`}
                        >
                          {category.cateName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle bg-transparent border-0 d-flex align-items-center"
                    type="button"
                    id="dropdownBrandsBottom"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img src={menu} alt="menu" className="me-3" />
                    <span className="me-4 d-inline-block">Thương hiệu</span>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-dark p-0"
                    aria-labelledby="dropdownBrandsBottom"
                  >
                    {brands.map((brand) => (
                      <li key={brand.id}>
                        <Link
                          className="dropdown-item text-white"
                          to={`/store?brandId=${brand.id}`}
                        >
                          {brand.brandName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <NavLink
                  to="/store"
                  className={({ isActive }) =>
                    isActive ? "text-warning" : "text-white"
                  }
                >
                  Cửa hàng
                </NavLink>
                <NavLink
                  to="/blogs"
                  className={({ isActive }) =>
                    isActive ? "text-warning" : "text-white"
                  }
                >
                  Tin tức
                </NavLink>
                <NavLink
                  to="/forum"
                  className={({ isActive }) =>
                    isActive ? "text-warning" : "text-white"
                  }
                >
                  Diễn đàn
                </NavLink>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? "text-warning" : "text-white"
                  }
                >
                  Về chúng tôi
                </NavLink>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    isActive ? "text-warning" : "text-white"
                  }
                >
                  Liên hệ
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
