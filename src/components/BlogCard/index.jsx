import React from "react";
import "./BlogCard.css";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

const BlogCard = ({ colSize, blog }) => {
  if (!blog) {
    return null;
  }

  const stripHtml = (html) => {
    if (!html) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.innerText;
  };

  const plainTextContent = stripHtml(blog.content);

  let formattedDate = "Ngày không xác định";
  if (blog.publishedDate) {
    try {
      formattedDate = format(parseISO(blog.publishedDate), "dd MMMM, yyyy");
    } catch (error) {
      console.error("Lỗi định dạng ngày:", error);
    }
  }

  return (
    <div className={colSize}>
      <div className="blog-card">
        <div className="card-image">
          <Link to={`/blog/${blog.title}`}>
            {blog.blogImage && blog.blogImage[0] ? (
              <img
                src={blog.blogImage[0]}
                className="img-fluid"
                alt={blog.title || "Blog Image"}
              />
            ) : (
              <div className="placeholder-image">Hình ảnh không khả dụng</div>
            )}
          </Link>
        </div>
        <div className="blog-content">
          <p className="date">{formattedDate}</p>
          <h5 className="title">{blog.title || "Tiêu đề không khả dụng"}</h5>
          <p className="description">{plainTextContent}</p>
          <Link to={`/blog/${blog.title}`} className="button">
            Đọc thêm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
