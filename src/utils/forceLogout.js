// utils/logoutHelper.js
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { clearToken } from "../contexts/AuthContext";

export const forceLogout = async () => {
 try {
      const { error } = await apiCall("POST", ApiEndpoints.LOGOUT);

      if (error) {
        console.error("Logout API failed:", error.message || error);
      }
    } catch (err) {
      console.error("Unexpected logout error:", err);
    }   

  clearToken();
  localStorage.removeItem("aepsType");
  localStorage.removeItem("user");
  localStorage.removeItem("user_nepal");
  localStorage.removeItem("nepal_token");
  localStorage.removeItem("location");
  localStorage.removeItem("docs");
  localStorage.removeItem("MoneyTransfer");


  window.location.href = "/login";
};
