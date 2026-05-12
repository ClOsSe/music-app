import { getAuthToken } from "./auth";
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

export function authHeaders(): HeadersInit {
  const token = getAuthToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}