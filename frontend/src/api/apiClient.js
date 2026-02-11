// frontend/src/api/apiClient.js
import axios from "axios";

export const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
});
