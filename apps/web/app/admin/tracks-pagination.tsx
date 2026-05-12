"use client";

import { useRouter } from "next/navigation";

type Props = {
  page: number;
  totalPages: number;
  search?: string;
};

export function TracksPagination({ page, totalPages, search }: Props) {
  const router = useRouter();

  function goToPage(nextPage: number) {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    params.set("page", String(nextPage));
    params.set("limit", "5");

    router.push(`/admin?${params.toString()}`);
  }

  return (
    <div className="mt-6 flex items-center gap-3">
      <button
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-sm">
        Page {page} / {totalPages}
      </span>

      <button
        disabled={page >= totalPages}
        onClick={() => goToPage(page + 1)}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
