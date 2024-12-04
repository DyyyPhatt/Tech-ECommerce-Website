import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/brands";

export const fetchBrands = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching brands.");
  }
};

export const fetchBrandById = async (brandId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${brandId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching brand by ID.");
  }
};
