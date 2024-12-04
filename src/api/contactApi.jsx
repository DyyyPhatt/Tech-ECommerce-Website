import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

export const fetchContactData = async () => {
  const response = await axios.get(`${API_BASE_URL}/contact/all`);
  return response.data[0];
};
