// src/api.js
import axios from "axios";

// Base URL for your backend API (CRA exposes REACT_APP_* at build time)
export const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create a dedicated axios instance
export const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10s
});

// ---- Auth token helpers ----------------------------------------------------
const TOKEN_STORAGE_KEY = "auth_token";

/** Read token from localStorage (if present). */
export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

/** Set/replace the token and update axios default header. */
export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      API.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      clearAuthToken();
    }
  } catch {
    // ignore storage errors (e.g., disabled storage)
  }
}

/** Remove token and header. */
export function clearAuthToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  delete API.defaults.headers.common.Authorization;
}

// Initialize header from any persisted token on first load
const initialToken = getAuthToken();
if (initialToken) {
  API.defaults.headers.common.Authorization = `Bearer ${initialToken}`;
}

// ---- Interceptors ----------------------------------------------------------

// Always attach the freshest token before each request
API.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Ensure we don't send a stale header
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optionally standardize/network error messages
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can hook 401 handling here if you want to auto-logout:
    // if (error?.response?.status === 401) clearAuthToken();
    return Promise.reject(error);
  }
);

// Convenience: quick health check (hits /health at the same host)
export async function healthCheck() {
  // If BASE_URL ends with /api, strip it to hit /health
  const root = BASE_URL.replace(/\/api\/?$/, "");
  const url = `${root}/health`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}
