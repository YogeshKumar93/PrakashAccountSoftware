import apiClient from "./apiClient";

export const loginApi = (username, password) =>
  apiClient.post("/auth/login", { username, password }).then((res) => res.data);
