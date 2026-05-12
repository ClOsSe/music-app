"use client";

import { useRouter } from "next/navigation";
import { deleteTrack } from "../lib/tracks-api";
type Props = {
  id: number;
};

export function DeleteTrackButton({ id }: Props) {
  const router = useRouter();
  async function onDelete() {
    const confirmed = confirm("Delete this track?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteTrack(id);

      router.refresh();
    } catch {
      alert("Delete failed");
    }
  }

  return (
    <button onClick={onDelete} className="rounded border px-2 py-1">
      Delete
    </button>
  );
}
