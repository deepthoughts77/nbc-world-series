import axios from "axios";

export const BASE_URL =
  process.env.REACT_APP_API_BASE || "http://localhost:5000"; // local fallback

export const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
});
