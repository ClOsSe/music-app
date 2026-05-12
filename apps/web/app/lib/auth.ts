export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export function logout() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("token");
}