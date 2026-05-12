"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { isAuthenticated, logout } from "../lib/auth";

export function AdminAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      logout();
      router.push("/login");
    }
  }, [router]);

  return null;
}
