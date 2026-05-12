import { jwtDecode } from "jwt-decode";

type AuthTokenPayload = {
  sub: number;
  email: string;
  role: "admin";
  exp: number;
};


export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !isTokenExpired();
}

export function logout() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("token");
}

export function getCurrentUser() {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  try {
    return jwtDecode<AuthTokenPayload>(token);
  } catch {
    return null;
  }
}
export function isTokenExpired() {
  const user = getCurrentUser();

  if (!user) {
    return true;
  }

  return user.exp * 1000 < Date.now();
}