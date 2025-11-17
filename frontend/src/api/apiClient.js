import axios from "axios";

// ---------- Axios helper ----------
const getApiBaseUrl = () => {
  // If explicitly set in environment, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // In production, use relative URL (works on any domain)
  if (process.env.NODE_ENV === "production") {
    return "/api";
  }

  // In development, use localhost
  return "http://localhost:5000/api";
};

export const API = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
});
