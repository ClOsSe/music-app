"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  defaultSearch?: string;
};

export function TracksSearchForm({ defaultSearch = "" }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(defaultSearch);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    params.set("page", "1");
    params.set("limit", "5");

    router.push(`/admin?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tracks..."
        className="w-full rounded border px-3 py-2"
      />

      <button className="rounded border px-4 py-2">Search</button>
    </form>
  );
}
