import PageSkeleton from "@/components/common/Loader/PageSkeleton";

/**
 * Shown the instant a service link is tapped, while the page renders on the server.
 * Without it the old page just sits there and the tap feels ignored.
 */
export default function ServiceLoading() {
  return <PageSkeleton variant="detail" label="Loading service" />;
}
