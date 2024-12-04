import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

export const fetchAdvertisements = async () => {
  const response = await axios.get(`${API_BASE_URL}/advertisement/all`);
  return response.data;
};
