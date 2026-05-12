"use client";
import { logout as AuthLogout } from "../lib/auth";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  function logout() {
    AuthLogout();
    router.push("/login");
  }

  return (
    <button onClick={logout} className="rounded-md border px-4 py-2">
      Logout
    </button>
  );
}
