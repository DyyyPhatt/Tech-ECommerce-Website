import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/product-conditions";

export const fetchProductConditions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching product conditions.");
  }
};

export const fetchProductConditionById = async (conditionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${conditionId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching product condition by ID.");
  }
};
