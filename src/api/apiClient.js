// api/apiClient.js
import axios from "axios";
import { BASE_URL } from "./ApiEndpoints";
import AuthContext, { getToken, clearToken } from "../contexts/AuthContext"; // import logout if exists
import { useContext } from "react";
import { forceLogout } from "../utils/forceLogout";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------------
// Request Deduplication + Memoization
// ------------------
const pendingRequests = new Map(); 
const cache = new Map();
const CACHE_TTL = 2000; 


apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);


apiClient.interceptors.response.use(
  
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    
forceLogout()
   
    }

    return Promise.reject(error);
  }
);


export const apiCall = async (method, url, data = null, params = null) => {
  try {
    const key = JSON.stringify({ method, url, data, params });

   
    if (cache.has(key)) {
      const { timestamp, response } = cache.get(key);
      if (Date.now() - timestamp < CACHE_TTL) {
        return { error: null, response }; // serve from cache
      } else {
        cache.delete(key);
      }
    }

    // 2. If request is already pending, return the same promise
    if (pendingRequests.has(key)) {
      return pendingRequests.get(key);
    }

    const isFormData = data instanceof FormData;

    const requestPromise = apiClient({
      method,
      url,
      data,
      params,
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    })
      .then((res) => {
        const response = res.data;
        cache.set(key, { response, timestamp: Date.now() }); // save in cache
        pendingRequests.delete(key);
        return { error: null, response };
      })
      .catch((err) => {
        pendingRequests.delete(key);
        return { error: err.response?.data || err.message, response: null };
      });

    // 3. Store pending request
    pendingRequests.set(key, requestPromise);

    return requestPromise;
  } catch (error) {
    console.error("API Error:", error);
    return { error: error.message, response: null };
  }
};

export default apiClient;
