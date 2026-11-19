import PageSkeleton from "@/components/common/Loader/PageSkeleton";

/** Instant placeholder while this server-rendered page loads (also prefetched with its links). */
export default function SearchLoading() {
  return <PageSkeleton variant="list" label="Loading search results" />;
}
