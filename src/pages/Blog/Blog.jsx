import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../../components/Other/BreadCrumb";
import FilterCard from "../../components/Other/FilterCard";
import LoadingSpinner from "../../components/Other/LoadingSpinner";
import BlogCard from "../../components/BlogCard";
import { fetchBlogs, fetchCategories } from "../../api/blogsApi";
import gr3 from "../../assets/images/gr3.svg";
import gr4 from "../../assets/images/gr4.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Blog = () => {
  // Khai báo state
  const [col, setCol] = useState("col-lg-3 col-md-6 col-sm-6 col-12");
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [sortOption, setSortOption] = useState("latest");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("categories");
  const [loading, setLoading] = useState(true);
  const blogsPerPage = 8;

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục blog:", error);
        toast.error("Lỗi khi lấy danh mục blog. Vui lòng thử lại sau.", {
          autoClose: 5000,
        });
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchBlogs(selectedCategories, sortOption);
        setBlogs(data);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
        toast.error("Lỗi khi lấy bài viết. Vui lòng thử lại sau.", {
          autoClose: 5000,
        });
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, [sortOption, selectedCategories]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
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
      <BreadCrumb title="Blog" />
      <div className="blog-wrapper home-wrapper-2 py-4">
        <div className="container">
          <div className="row">
            <div data-aos="fade-up" className="col-lg-3 col-md-4 col-sm-12">
              <FilterCard
                title="Lọc theo danh mục"
                filterType="categories"
                options={categories}
                selectedIds={selectedCategories}
                handleChange={handleCategoryChange}
                toggleFilter={toggleFilter}
                activeFilter={activeFilter}
              />
            </div>

            <div data-aos="fade-up" className="col-lg-9 col-md-8 col-sm-12">
              <div className="filter-sort-grid">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-15">
                    <p className="mb-0 text-secondary w-50">Sắp xếp theo:</p>
                    <select
                      className="form-control form-select bg-body-secondary"
                      onChange={handleSortChange}
                      value={sortOption}
                    >
                      <option value="latest">Ngày, Mới đến cũ</option>
                      <option value="oldest">Ngày, Cũ đến mới</option>
                    </select>
                  </div>
                  <div className="d-flex align-items-center gap-10">
                    <p className="total-products text-secondary mb-0">
                      {blogs.length} Bài viết
                    </p>
                    <div className="d-flex gap-10 align-items-center grid">
                      <img
                        onClick={() =>
                          setCol("col-lg-3 col-md-4 col-sm-6 col-12")
                        }
                        src={gr4}
                        className="img-fluid"
                        alt="col-3"
                      />
                      <img
                        onClick={() =>
                          setCol("col-lg-4 col-md-4 col-sm-6 col-12")
                        }
                        src={gr3}
                        className="img-fluid"
                        alt="col-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                {currentBlogs.map((blog) => (
                  <BlogCard key={blog.title} colSize={col} blog={blog} />
                ))}
              </div>

              <nav aria-label="Page navigation">
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
                      Trước
                    </Link>
                  </li>
                  {[
                    ...Array(Math.ceil(blogs.length / blogsPerPage)).keys(),
                  ].map((number) => {
                    const pageNumber = number + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === Math.ceil(blogs.length / blogsPerPage) ||
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
                        Math.ceil(blogs.length / blogsPerPage) - 1 &&
                      currentPage < Math.ceil(blogs.length / blogsPerPage) - 2
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
                      currentPage === Math.ceil(blogs.length / blogsPerPage)
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <Link
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      aria-disabled={
                        currentPage === Math.ceil(blogs.length / blogsPerPage)
                      }
                    >
                      Tiếp
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
