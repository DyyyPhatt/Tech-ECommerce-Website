import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BlogDetails.css";
import { jwtDecode } from "jwt-decode";
import { fetchBlogDetails, addCommentToBlog } from "../../api/blogsApi";
import BreadCrumb from "../../components/Other/BreadCrumb";
import LoadingSpinner from "../../components/Other/LoadingSpinner";
import NotFound from "../../components/Other/404Page";

const BlogDetails = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const userToken = localStorage.getItem("userToken");
  let userId = null;

  if (userToken) {
    const decodedToken = jwtDecode(userToken);
    userId = decodedToken.id;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    loadBlogDetails();
  }, [title, navigate]);

  const loadBlogDetails = async () => {
    try {
      const data = await fetchBlogDetails(title);
      if (data.length > 0) {
        const blogData = data[0];
        setBlog(blogData);

        // Fetch author details
        if (blogData.author) {
          const authorData = await fetchEmployeeById(blogData.author);
          setAuthor(authorData);
        }

        // Fetch comments with user details
        const updatedComments = await Promise.all(
          blogData.comments.map(async (comment) => {
            const userDetails = await fetchUserById(comment.user);
            return {
              ...comment,
              userName: userDetails.username,
            };
          })
        );
        setComments(updatedComments);
      } else {
        toast.error("Không tìm thấy bài viết!", { autoClose: 5000 });
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin bài viết hoặc tác giả:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeById = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/employees/${id}`);
      if (!response.ok) {
        throw new Error("Không tìm thấy thông tin tác giả.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin tác giả:", error);
      toast.error("Lỗi khi lấy thông tin tác giả!", { autoClose: 5000 });
    }
  };

  const fetchUserById = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/users/${id}`);
      if (!response.ok) {
        throw new Error("Không tìm thấy thông tin người dùng.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!userToken) {
      toast.error("Vui lòng đăng nhập để bình luận!");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Bình luận không thể để trống!");
      return;
    }

    try {
      const comment = {
        user: userId,
        comment: newComment,
        createdAt: new Date(),
      };

      const updatedBlog = await addCommentToBlog(blog.id, comment);
      setBlog(updatedBlog);
      setNewComment("");

      const updatedComments = [...comments, { ...comment, userName: "User" }];
      setComments(updatedComments);

      toast.success("Bình luận đã được thêm!");
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
      toast.error("Lỗi khi thêm bình luận!", { autoClose: 5000 });
    }
  };

  const handleBackClick = () => {
    navigate("/blogs");
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      {blog ? (
        <>
          <ToastContainer />
          <BreadCrumb title="Blog / Chi tiết bài viết" />
          <div className="blog-details-container">
            <div className="blog-content-wrapper">
              <BlogHeader blog={blog} author={author} />
              <BlogImage blogImage={blog.blogImage} title={blog.title} />
              <BlogContent content={blog.content} />
              <CommentsSection
                comments={comments}
                newComment={newComment}
                setNewComment={setNewComment}
                handleCommentSubmit={handleCommentSubmit}
              />
              <BackButton onBackClick={handleBackClick} />
            </div>
          </div>
        </>
      ) : (
        <NotFound />
      )}
    </>
  );
};

// Component tiêu đề bài viết
const BlogHeader = ({ blog, author }) => (
  <>
    <h1 data-aos="fade-up" className="blog-title">
      {blog.title}
    </h1>
    <div data-aos="fade-up" className="blog-meta">
      <span className="blog-author">
        Tác giả: {author ? author.username : "Tác giả không xác định"}
      </span>
      <span className="blog-date">
        Được xuất bản vào {new Date(blog.publishedDate).toLocaleDateString()}
      </span>
    </div>
  </>
);

// Component hình ảnh bài viết
const BlogImage = ({ blogImage, title }) => {
  if (!Array.isArray(blogImage) || blogImage.length === 0) return null;

  return (
    <div data-aos="fade-up" className="blog-image-container">
      {blogImage.length === 1 && (
        <div className="full-image">
          <img src={blogImage[0]} alt={title} />
        </div>
      )}
      {blogImage.length === 2 && (
        <div className="two-images">
          {blogImage.map((image, index) => (
            <div key={index} className="half-image">
              <img src={image} alt={`${title} - Hình ảnh ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
      {blogImage.length === 3 && (
        <div className="three-images">
          {blogImage.map((image, index) => (
            <div key={index} className="third-image">
              <img src={image} alt={`${title} - Hình ảnh ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
      {blogImage.length >= 4 && (
        <div className="four-images">
          <div className="main-image">
            <img src={blogImage[0]} alt={title} />
          </div>
          <div className="small-images">
            {blogImage.slice(1, 4).map((image, index) => (
              <div key={index} className="small-image">
                <img src={image} alt={`${title} - Hình ảnh ${index + 2}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Component nội dung bài viết
const BlogContent = ({ content }) => (
  <div
    data-aos="fade-up"
    className="blog-content"
    dangerouslySetInnerHTML={{ __html: content }}
  />
);

// Component phần bình luận
const CommentsSection = ({
  comments,
  newComment,
  setNewComment,
  handleCommentSubmit,
}) => (
  <div data-aos="fade-up" className="comments-section">
    <h3>Bình luận ({comments.length})</h3>
    {comments.length > 0 ? (
      comments.map((comment, index) => (
        <Comment key={index} user={comment.userName} text={comment.comment} />
      ))
    ) : (
      <p>Chưa có bình luận nào.</p>
    )}
    <CommentForm
      newComment={newComment}
      setNewComment={setNewComment}
      handleCommentSubmit={handleCommentSubmit}
    />
  </div>
);

// Component bình luận
const Comment = ({ user, text }) => (
  <div className="comment">
    <p className="comment-author">{user}:</p>
    <p className="comment-text">"{text}"</p>
  </div>
);

// Component form bình luận
const CommentForm = ({ newComment, setNewComment, handleCommentSubmit }) => (
  <form className="comment-form" onSubmit={handleCommentSubmit}>
    <textarea
      id="comment-input"
      className="comment-input mt-5"
      rows="4"
      placeholder="Viết bình luận của bạn ở đây..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
    />
    <button type="submit" className="submit-comment-btn">
      Gửi bình luận
    </button>
  </form>
);

// Component nút quay lại
const BackButton = ({ onBackClick }) => (
  <div className="back-button">
    <button onClick={onBackClick} className="back-blog-btn">
      Quay lại Blog
    </button>
  </div>
);

export default BlogDetails;
