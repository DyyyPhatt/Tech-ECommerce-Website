import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/tags";

export const fetchTags = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching tags.");
  }
};

export const fetchTagsByIds = async (tagIds) => {
  const responses = await Promise.all(
    tagIds.map((tagId) => axios.get(`${API_BASE_URL}/${tagId}`))
  );
  return responses.map((res) => res.data);
};
