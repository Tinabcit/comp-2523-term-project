// add the changes and make sure to import useFakeAuth from the correct path .
import { Link, useNavigate } from "@tanstack/react-router";
import { authClient } from "#/lib/auth-client";

export function HeaderAuth() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    navigate({ to: "/" });
  };

  if (isPending) {
    return <div className="text-sm text-[#7a6750]">Loading...</div>;
  }

  if (session?.user) {
    const fullName =
      (session.user as { fullName?: string; name?: string }).fullName ||
      session.user.name ||
      "User";

    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[#4f3f2e]">
          Hi, {fullName}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl bg-[#b45309] px-3 py-2 font-semibold text-white"
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