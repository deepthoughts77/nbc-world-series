// frontend/src/api.js
import axios from "axios";

function computeBaseUrl() {
  // Preferred: explicit build-time env var
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/+$/, "");
  }

  // Browser runtime fallback
  if (typeof window !== "undefined") {
    const origin = window.location.origin;

    // Local dev: frontend on 3000, backend on 5000
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      return "http://localhost:5000/api";
    }

    // Production: assume backend is same origin + /api
    return `${origin}/api`;
  }

  return "http://localhost:5000/api";
}

export const BASE_URL = computeBaseUrl();

export const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
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
    // ignore
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // ignore
  }
  delete API.defaults.headers.common.Authorization;
}

// init from storage
const initialToken = getAuthToken();
if (initialToken) {
  API.defaults.headers.common.Authorization = `Bearer ${initialToken}`;
}

API.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    else delete config.headers.Authorization;
    return config;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
