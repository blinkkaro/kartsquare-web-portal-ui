import PageSkeleton from "@/components/common/Loader/PageSkeleton";

/** Instant placeholder while this server-rendered page loads (also prefetched with its links). */
export default function ProductLoading() {
  return <PageSkeleton variant="detail" label="Loading product" />;
}
