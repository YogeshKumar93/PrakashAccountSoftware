import { apiCall } from "./apiClient";
import ApiEndpoints from "./ApiEndpoints";
import { fetchWithCache } from "./cache";
// adjust import as needed

export const getUserProfile = async (authCtx, navigate) => {
  return fetchWithCache("profile", async () => {
    try {
      const userRes = await apiCall("GET", ApiEndpoints.GET_ME_USERss);
      if (!userRes.error) {
        authCtx.saveUser(userRes.response.data);
        navigate("/dashboard");
        return userRes.response.data;
      } else {
        throw new Error("Failed to fetch user profile");
      }
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  });
};
