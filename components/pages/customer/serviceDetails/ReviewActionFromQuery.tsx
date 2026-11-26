"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Opens the review form for links that carry ?action=review.
 *
 * Kept on its own so that only this empty component needs a Suspense boundary: reading search params inside the
 * details view made Next leave the whole page out of the server HTML.
 */
export default function ReviewActionFromQuery({ onReview }: { onReview: () => void }) {
  const action = useSearchParams()?.get("action");
  useEffect(() => {
    if (action === "review") onReview();
    // Follows the query only; the callback is a new function on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);
  return null;
}
