// src/utils/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1", // proxy ke through backend ka prefix
  withCredentials: true,
});

export default api;
