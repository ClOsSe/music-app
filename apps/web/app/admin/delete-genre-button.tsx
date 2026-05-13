"use client";

import { useRouter } from "next/navigation";

import { deleteGenre } from "../lib/genres-api";

type Props = {
  id: number;
};

export function DeleteGenreButton({ id }: Props) {
  const router = useRouter();

  async function onDelete() {
    const confirmed = confirm("Delete this genre?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteGenre(id);
      router.refresh();
    } catch {
      alert("Delete genre failed");
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      className="rounded border px-2 py-1 text-sm"
    >
      Delete
    </button>
  );
}
