//export const isLoggedIn = false;
// add the changes and make sure everything works well.
export interface DevJokesUser {
  fullName: string;
  email: string;
  password: string;
}

export function getStoredUser(): DevJokesUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("devjokesUser");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as DevJokesUser;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("isLoggedIn") === "true";
}

export function loginUser() {
  if (typeof window === "undefined") return;
  localStorage.setItem("isLoggedIn", "true");
  window.dispatchEvent(new Event("auth-change"));
}

export function logoutUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("isLoggedIn");
  window.dispatchEvent(new Event("auth-change"));
}

export function saveUser(user: DevJokesUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem("devjokesUser", JSON.stringify(user));
  localStorage.setItem("isLoggedIn", "true");
  window.dispatchEvent(new Event("auth-change"));
}