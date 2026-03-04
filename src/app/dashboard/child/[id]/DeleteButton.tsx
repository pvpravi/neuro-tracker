"use client"; // This is the magic line

import { deleteChild } from "./actions";

export default function DeleteButton({ childId, childName }: { childId: string, childName: string }) {
  return (
    <form action={deleteChild}>
      <input type="hidden" name="childId" value={childId} />
      <button
        type="submit"
        className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition"
        onClick={(e) => {
          if (!confirm(`Are you sure? This will delete ${childName}'s profile and all clinical records.`)) {
            e.preventDefault(); // This now works because it's a Client Component
          }
        }}
      >
        Delete {childName}&apos;s Profile
      </button>
    </form>
  );
}