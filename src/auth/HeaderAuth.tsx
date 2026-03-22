import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getStoredUser, isLoggedIn, logoutUser } from "#/auth/fakeAuth";

export function HeaderAuth() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const syncAuth = () => {
      const user = getStoredUser();
      setLoggedIn(isLoggedIn());
      setFullName(user?.fullName ?? "");
    };

    syncAuth();

    window.addEventListener("auth-change", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("auth-change", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/";
  };

  if (loggedIn) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[#4f3f2e]">
          Hi, {fullName || "User"}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl px-3 py-2 font-semibold text-white bg-[#b45309]"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link to="/signin" className="font-semibold text-[#b45309]">
        Sign in
      </Link>
      <Link to="/signup" className="font-semibold text-[#b45309]">
        Sign up
      </Link>
    </div>
  );
}