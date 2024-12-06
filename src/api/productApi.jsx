import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

export const fetchProducts = async (
  sortBy = "newest",
  categoryId = null,
  brandId = null
) => {
  try {
    let url = `${API_BASE_URL}/products?sortBy=${sortBy}`;

    if (categoryId) {
      url += `&categoryIds=${categoryId}`;
    }

    if (brandId) {
      url += `&brandIds=${brandId}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchSpecialProducts = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/products?sortBy=rating-high-to-low`
  );
  return response.data;
};

export const fetchDiscountedProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/products/highest-discount`);
  return response.data;
};

export const fetchProductDetails = async (productName) => {
  const response = await axios.get(
    `${API_BASE_URL}/products/search?q=${productName}`
  );
  return response.data;
};

export const fetchProductReviews = async (productId) => {
  const response = await axios.get(
    `${API_BASE_URL}/reviews/product/${productId}`
  );
  return response.data;
};
