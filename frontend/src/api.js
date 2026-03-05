import axios from "axios";

function computeBaseUrl() {
  // 1. Check for explicit environment variable
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/+$/, "");
  }

  // 2. Browser runtime logic
  if (typeof window !== "undefined") {
    const origin = window.location.origin;

    // Local Development
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      return "http://localhost:5000/api";
    }

    // Production (Render)
    // If your frontend is on 'nbc-world-series-frontend.onrender.com'
    // and backend is on 'nbc-world-series.onrender.com',
    // the 'origin' logic fails. We hardcode the backend URL here.
    if (origin.includes("onrender.com")) {
      return "https://nbc-world-series.onrender.com/api";
    }

    return `${origin}/api`;
  }

  return "http://localhost:5000/api";
}

export const BASE_URL = computeBaseUrl();

export const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const TOKEN_STORAGE_KEY = "auth_token";

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      API.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      clearAuthToken();
    }
  } catch {
    /* ignore */
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  delete API.defaults.headers.common.Authorization;
}

// Interceptors
API.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // DEBUG: This prevents the double /api/api issue
    // If a developer accidentally passes '/api/teams', we strip the extra '/api'
    if (config.url.startsWith("/api/")) {
      config.url = config.url.replace("/api/", "/");
    }

    return config;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
