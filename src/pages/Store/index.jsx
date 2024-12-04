import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Store.css";
import { fetchBrands } from "../../api/brandApi";
import { fetchCategories } from "../../api/categoryApi";
import { fetchProductConditions } from "../../api/productConditionApi";
import { fetchTags } from "../../api/tagApi";
import BreadCrumb from "../../components/Other/BreadCrumb";
import LoadingSpinner from "../../components/Other/LoadingSpinner";
import FilterCard from "../../components/Other/FilterCard";
import ProductCard from "../../components/ProductCard";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import gr3 from "../../assets/images/gr3.svg";
import gr4 from "../../assets/images/gr4.svg";

const Store = () => {
  // State for filters and products
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState([]);
  const [selectedConditionIds, setSelectedConditionIds] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productConditions, setProductConditions] = useState([]);
  const [tags, setTags] = useState([]);
  const [col, setCol] = useState("col-lg-3 col-md-6 col-sm-6 col-12");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("categories");

  // State for handling navigation and sorting
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategoryId = queryParams.get("categoryId");
  const selectedBrandId = queryParams.get("brandId");

  // Fetch products based on filters
  const fetchProducts = async (sortBy = "newest") => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/products?sortBy=${sortBy}&minPrice=${minPrice}&maxPrice=${maxPrice}&brandIds=${selectedBrandIds.join(
          ","
        )}&categoryIds=${selectedCategoryIds.join(
          ","
        )}&conditionIds=${selectedConditionIds.join(
          ","
        )}&tagIds=${selectedTags.join(",")}`
      );

      const productsWithDetails = await Promise.all(
        response.data.map(async (product) => {
          const brandResponse = await axios.get(
            `http://localhost:8081/api/brands/${product.brand}`
          );
          const brand = brandResponse.data;

          const conditionResponse = await fetch(
            `http://localhost:8081/api/product-conditions/${product.condition}`
          );
          const condition = await conditionResponse.json();

          return {
            ...product,
            brandName: brand.brandName,
            conditionName: condition.conditionName,
          };
        })
      );

      setProducts(productsWithDetails);
    } catch (error) {
      toast.error("Error fetching products.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch brands, categories, conditions, and tags
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const brandData = await fetchBrands();
        setBrands(brandData);

        const categoryData = await fetchCategories();
        setCategories(categoryData);

        const conditionData = await fetchProductConditions();
        setProductConditions(conditionData);

        const tagData = await fetchTags();
        setTags(tagData);
      } catch (error) {
        toast.error("Error fetching data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle category and brand changes
  useEffect(() => {
    if (selectedCategoryId) {
      handleCategoryChange(selectedCategoryId);
    }
    if (selectedBrandId) {
      handleBrandChange(selectedBrandId);
    }
    if (selectedCategoryId || selectedBrandId) {
      navigate(location.pathname, { replace: true });
    }
  }, [selectedCategoryId, selectedBrandId, navigate, location.pathname]);

  // Fetch products whenever filters change
  useEffect(() => {
    fetchProducts();
  }, [
    minPrice,
    maxPrice,
    selectedBrandIds,
    selectedCategoryIds,
    selectedConditionIds,
    selectedTags,
  ]);

  // Handlers for filtering
  const handleSortChange = (event) => {
    const selectedSort = event.target.value;
    fetchProducts(selectedSort);
  };

  const handleMinPriceChange = (e) => {
    const value = e.target ? e.target.value : "";
    setMinPrice(value && !isNaN(value) ? parseFloat(value) : "");
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target ? e.target.value : "";
    setMaxPrice(value && !isNaN(value) ? parseFloat(value) : "");
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrandIds((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handleConditionChange = (conditionId) => {
    setSelectedConditionIds((prev) =>
      prev.includes(conditionId)
        ? prev.filter((id) => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  const handleTagChange = (tagId) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId)
        ? prevTags.filter((t) => t !== tagId)
        : [...prevTags, tagId]
    );
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const toggleFilter = (filterName) => {
    setActiveFilter((prevFilter) =>
      prevFilter === filterName ? null : filterName
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <ToastContainer />
      <BreadCrumb title="Cửa Hàng Của Chúng Tôi" />
      <section className="store-wrapper py-4 home-wrapper-2">
        <div className="container">
          <div className="row">
            <div data-aos="fade-up" className="col-lg-3 col-md-4 col-sm-12">
              <FilterCard
                title="Mua Theo Danh Mục"
                filterType="categories"
                options={categories}
                selectedIds={selectedCategoryIds}
                handleChange={handleCategoryChange}
                toggleFilter={toggleFilter}
                activeFilter={activeFilter}
              />

              <FilterCard
                title="Mua Theo Thương Hiệu"
                filterType="brands"
                options={brands}
                selectedIds={selectedBrandIds}
                handleChange={handleBrandChange}
                toggleFilter={toggleFilter}
                activeFilter={activeFilter}
              />

              <div className="filter-card mb-3">
                <h3 className="filter-title d-flex justify-content-between align-items-center">
                  Lọc Theo Giá
                  <button
                    className="btn btn-link p-0"
                    type="button"
                    onClick={() => toggleFilter("price")}
                    aria-expanded={activeFilter === "price"}
                    aria-controls="collapsePrice"
                  >
                    <i
                      className={`fas ${
                        activeFilter === "price"
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                    ></i>
                  </button>
                </h3>
                <AnimatePresence>
                  {activeFilter === "price" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      id="collapsePrice"
                    >
                      <div className="price-filter">
                        <div className="price-inputs">
                          <input
                            type="number"
                            placeholder="Giá Tối Thiểu"
                            value={minPrice}
                            onChange={handleMinPriceChange}
                            className="price-input"
                          />
                          <span>-</span>
                          <input
                            type="number"
                            placeholder="Giá Tối Đa"
                            value={maxPrice}
                            onChange={handleMaxPriceChange}
                            className="price-input"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <FilterCard
                title="Mua Theo Tình Trạng Sản Phẩm"
                filterType="conditions"
                options={productConditions}
                selectedIds={selectedConditionIds}
                handleChange={handleConditionChange}
                toggleFilter={toggleFilter}
                activeFilter={activeFilter}
              />

              <FilterCard
                title="Mua Theo Thẻ Sản Phẩm"
                filterType="tags"
                options={tags}
                selectedIds={selectedTags}
                handleChange={handleTagChange}
                toggleFilter={toggleFilter}
                activeFilter={activeFilter}
              />
            </div>

            <div data-aos="fade-up" className="col-lg-9 col-md-8 col-sm-12">
              <div className="filter-sort-grid">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-15">
                    <p className="mb-0 text-secondary w-50">Sắp Xếp Theo:</p>
                    <select
                      name="sortBy"
                      className="form-control form-select bg-body-secondary"
                      onChange={handleSortChange}
                    >
                      <option value="newest">Ngày, Mới Đến Cũ</option>
                      <option value="oldest">Ngày, Cũ Đến Mới</option>
                      <option value="discountprice-high-to-low">
                        Giá, Cao Đến Thấp
                      </option>
                      <option value="discountprice-low-to-high">
                        Giá, Thấp Đến Cao
                      </option>
                      <option value="rating-high-to-low">
                        Đánh Giá, Cao Đến Thấp
                      </option>
                      <option value="rating-low-to-high">
                        Đánh Giá, Thấp Đến Cao
                      </option>
                    </select>
                  </div>
                  <div className="d-flex align-items-center gap-10">
                    <p className="total-products text-secondary mb-0">
                      {totalProducts} Sản Phẩm
                    </p>
                    <div className="d-flex gap-10 align-items-center grid">
                      <img
                        onClick={() => {
                          setCol("col-lg-3 col-md-4 col-sm-6 col-12");
                        }}
                        src={gr4}
                        className="img-fluid"
                        alt="col-3"
                      />
                      <img
                        onClick={() => {
                          setCol("col-lg-4 col-md-4 col-sm-6 col-12");
                        }}
                        src={gr3}
                        className="img-fluid"
                        alt="col-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                {currentProducts.map((product) => (
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
              <nav aria-label="Phân Trang">
                <ul className="pagination justify-content-end gap-10 mt-4">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <Link
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      aria-disabled={currentPage === 1}
                    >
                      Quay Lại
                    </Link>
                  </li>

                  {[
                    ...Array(Math.ceil(totalProducts / productsPerPage)).keys(),
                  ].map((number) => {
                    const pageNumber = number + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber ===
                        Math.ceil(totalProducts / productsPerPage) ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <li
                          key={pageNumber}
                          className={`page-item ${
                            currentPage === pageNumber ? "active" : ""
                          }`}
                        >
                          <Link
                            className="page-link"
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </Link>
                        </li>
                      );
                    }
                    if (pageNumber === 2 && currentPage > 3) {
                      return (
                        <li key={pageNumber} className="page-item">
                          <span className="page-link">...</span>
                        </li>
                      );
                    }
                    if (
                      pageNumber ===
                        Math.ceil(totalProducts / productsPerPage) - 1 &&
                      currentPage <
                        Math.ceil(totalProducts / productsPerPage) - 2
                    ) {
                      return (
                        <li key={pageNumber} className="page-item">
                          <span className="page-link">...</span>
                        </li>
                      );
                    }
                    return null;
                  })}

                  <li
                    className={`page-item ${
                      currentPage === Math.ceil(totalProducts / productsPerPage)
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <Link
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      aria-disabled={
                        currentPage ===
                        Math.ceil(totalProducts / productsPerPage)
                      }
                    >
                      Tiếp Theo
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Store;
