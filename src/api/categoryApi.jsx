import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/categories";

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching categories.");
  }
};

export const fetchCategoryById = async (categoryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching category by ID.");
  }
};
