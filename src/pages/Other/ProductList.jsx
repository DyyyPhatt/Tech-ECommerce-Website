import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  fetchProducts,
  fetchSpecialProducts,
  fetchDiscountedProducts,
} from "../../api/productApi";
import { fetchBrandById } from "../../api/brandApi";
import { fetchProductConditionById } from "../../api/productConditionApi";
import ProductCard from "../../components/ProductCard";
import BreadCrumb from "../../components/Other/BreadCrumb";
import LoadingSpinner from "../../components/Other/LoadingSpinner";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProductList = async () => {
      setLoading(true);
      try {
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

        let fetchedProducts;
        if (type === "newest") {
          fetchedProducts = await addBrandAndConditionNames(
            await fetchProducts()
          );
        } else if (type === "discounted") {
          fetchedProducts = await addBrandAndConditionNames(
            await fetchDiscountedProducts()
          );
        } else if (type === "special") {
          fetchedProducts = await addBrandAndConditionNames(
            await fetchSpecialProducts()
          );
        }
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductList();
  }, [type]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <BreadCrumb
        title={
          type === "newest"
            ? "Sản Phẩm Mới Nhất"
            : type === "discounted"
            ? "Sản Phẩm Giảm Giá"
            : "Sản Phẩm Đánh Giá Cao"
        }
      />
      <div className="home-wrapper-2 py-5">
        <div className="container">
          <div className="row">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                colSize="col-lg-3 col-md-4 col-sm-6 col-12"
              />
            ))}
          </div>
          <nav aria-label="Phân Trang">
            <ul className="pagination justify-content-end gap-10 mt-4">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Quay Lại
                </button>
              </li>
              {[...Array(totalPages).keys()].map((number) => {
                const pageNumber = number + 1;
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
              })}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Tiếp Theo
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default ProductList;
