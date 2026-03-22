//export const isLoggedIn = false;
export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("isLoggedIn") === "true";
}