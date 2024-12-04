import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

export const fetchBlogs = async (categories, sortOption) => {
  const categoriesQuery =
    categories.length > 0 ? categories.map(encodeURIComponent).join(",") : "";

  const url = `${API_BASE_URL}/blogs/sorted?sortOrder=${sortOption}&categories=${categoriesQuery}`;

  const response = await axios.get(url);
  return response.data;
};

export const fetchBlogDetails = async (title) => {
  const response = await axios.get(
    `${API_BASE_URL}/blogs/search?title=${title}`
  );
  return response.data;
};

export const fetchCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/blogcategories/all`);
  return response.data;
};

export const fetchLatestBlogs = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/blogs/sorted?sortOrder=latest`
  );
  return response.data.slice(0, 8);
};

export const addCommentToBlog = async (blogId, comment) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });

    if (!response.ok) {
      throw new Error("Không thể thêm bình luận");
    }

    return await response.json();
  } catch (error) {
    console.error("Lỗi khi gửi bình luận:", error);
    throw error;
  }
};
