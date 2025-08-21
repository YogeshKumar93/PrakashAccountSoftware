// api/apiClient.js
import axios from "axios";
import { BASE_URL } from "./ApiEndpoints";
import { getToken, clearToken } from "../contexts/AuthContext";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken(); // always read from localStorage via utility
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response?.status === 401) {
    //   clearToken();
    //   window.location.href = "/login";
    // }
    return Promise.reject(error);
  }
);

// Unified API caller
export const apiCall = async (method, url, data = null, params = null) => {
  try {
    const isFormData = data instanceof FormData;

    const response = await apiClient({
      method,
      url,
      data,
      params,
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined, // default JSON handled by axios
    });

    return { error: null, response: response.data };
  } catch (error) {
    console.error("API Error:", error);
    return { error: error.response?.data || error.message, response: null };
  }
};

export default apiClient;
