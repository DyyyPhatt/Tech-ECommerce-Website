import React, { useState, useEffect, useContext } from "react";
import ProductCard from "../../components/ProductCard";
import BreadCrumb from "../../components/Other/BreadCrumb";
import LoadingSpinner from "../../components/Other/LoadingSpinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FavoritesContext from "../../components/Context/FavoritesContext";

const Wishlist = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const [loading, setLoading] = useState(true);
  const [col, setCol] = useState("col-lg-3 col-md-6 col-sm-6 col-12");

  useEffect(() => {
    setLoading(false);
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = favorites.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleToggleFavorite = (product) => {
    toggleFavorite(product);
    toast.success(
      product.isLiked
        ? "Sản phẩm đã được thêm vào yêu thích!"
        : "Sản phẩm đã được gỡ khỏi yêu thích!"
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <ToastContainer />
      <BreadCrumb title="Danh sách yêu thích" />
      <div className="wishlist-wrapper home-wrapper-2 py-4">
        <div data-aos="fade-up" className="container">
          <div className="row">
            <div className="row mt-3">
              {currentProducts.length === 0 ? (
                <div className="text-center mt-4">
                  Danh sách yêu thích của bạn hiện tại trống.
                </div>
              ) : (
                currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    colSize={col}
                    product={product}
                    handleToggleFavorite={handleToggleFavorite}
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
                  ...Array(
                    Math.ceil(favorites.length / productsPerPage)
                  ).keys(),
                ].map((number) => {
                  const pageNumber = number + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber ===
                      Math.ceil(favorites.length / productsPerPage) ||
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
                      Math.ceil(favorites.length / productsPerPage) - 1 &&
                    currentPage <
                      Math.ceil(favorites.length / productsPerPage) - 2
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
                    currentPage ===
                    Math.ceil(favorites.length / productsPerPage)
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-disabled={
                      currentPage ===
                      Math.ceil(favorites.length / productsPerPage)
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

export default Wishlist;
