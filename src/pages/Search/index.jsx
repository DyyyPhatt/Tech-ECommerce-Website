import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import BreadCrumb from "../../components/Other/BreadCrumb";
import LoadingSpinner from "../../components/Other/LoadingSpinner";
import { fetchBrands } from "../../api/brandApi";
import { fetchProductConditions } from "../../api/productConditionApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchResults = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [col, setCol] = useState("col-lg-3 col-md-6 col-sm-6 col-12");
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const [response, brandsData, conditionsData] = await Promise.all([
          fetch(`http://localhost:8081/api/products/search?q=${query}`),
          fetchBrands(),
          fetchProductConditions(),
        ]);

        const products = await response.json();

        // Kết hợp dữ liệu sản phẩm với brand và condition
        const productsWithDetails = products.map((product) => {
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

        setProducts(productsWithDetails);
      } catch (error) {
        toast.error(`Lỗi khi tải sản phẩm: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <ToastContainer />
      <BreadCrumb title={`Kết quả tìm kiếm cho "${query}"`} />
      <div className="search-results-wrapper home-wrapper-2 py-4">
        <div className="container">
          <div className="row">
            <div className="row mt-3">
              {currentProducts.length === 0 ? (
                <div className="text-center mt-4">
                  Không tìm thấy sản phẩm phù hợp.
                </div>
              ) : (
                currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    colSize={col}
                    product={{
                      ...product,
                      brand: product.brandName,
                      condition: product.conditionName,
                    }}
                  />
                ))
              )}
            </div>
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-end gap-10 mt-4">
                {/* Nút Previous */}
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-disabled={currentPage === 1}
                  >
                    Trước
                  </button>
                </li>

                {/* Các số trang */}
                {[
                  ...Array(Math.ceil(products.length / productsPerPage)).keys(),
                ].map((number) => {
                  const pageNumber = number + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber ===
                      Math.ceil(products.length / productsPerPage) ||
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
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
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
                      Math.ceil(products.length / productsPerPage) - 1 &&
                    currentPage <
                      Math.ceil(products.length / productsPerPage) - 2
                  ) {
                    return (
                      <li key={pageNumber} className="page-item">
                        <span className="page-link">...</span>
                      </li>
                    );
                  }
                  return null;
                })}

                {/* Nút Next */}
                <li
                  className={`page-item ${
                    currentPage === Math.ceil(products.length / productsPerPage)
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-disabled={
                      currentPage ===
                      Math.ceil(products.length / productsPerPage)
                    }
                  >
                    Tiếp
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResults;
