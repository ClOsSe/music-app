"use client";

import { getCurrentUser } from "../lib/auth";

export function AdminUser() {
  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  return <p className="text-sm text-gray-500">Logged in as {user.email}</p>;
}
