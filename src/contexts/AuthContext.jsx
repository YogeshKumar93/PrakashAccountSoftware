// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";

// Token management utilities
export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const clearToken = () => localStorage.removeItem("token");
 export const clerUser=()=>localStorage.removeItem("user");
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const userData=localStorage.getItem("user");
  const [user, setUser] = useState(userData);
  const [loading, setLoading] = useState(true);

  // Load user profile from API
  const loadUserProfile = async () => {
    try {
      const { error, response } = await apiCall("GET", ApiEndpoints.GET_ME_USER);

      if (error) throw new Error(error.message || "Failed to load user profile");

      if (response?.data) {
        setUser(response.data);
        localStorage.setItem("user", response.data)
        return response.data;
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
      logout(); // fallback if profile fails
      throw err;
    }
  };

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();

      if (token) {
        try {
          await loadUserProfile();
        } catch (err) {
          console.error("Authentication initialization failed:", err);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (token) => {
    try {
      setToken(token);
      const userProfile = await loadUserProfile();
      return userProfile;
    } catch (err) {
      clearToken();
      clerUser()
      throw err;
    }
  };

  // Logout API + cleanup
  const logout = async () => {
    try {
      const { error } = await apiCall("POST", ApiEndpoints.LOGOUT);

      if (error) {
        console.error("Logout API failed:", error.message || error);
      }
    } catch (err) {
      console.error("Unexpected logout error:", err);
    }

    // Always clear local state and redirect
    clearToken();
    setUser(null);
    clerUser()
    // window.location.href = "/login";
  };

  const saveUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    saveUser,
    isAuthenticated: !!user && !!getToken(),
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
