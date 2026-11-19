import PageSkeleton from "@/components/common/Loader/PageSkeleton";

/** Instant placeholder while this server-rendered page loads (also prefetched with its links). */
export default function ServicesListLoading() {
  return <PageSkeleton variant="list" label="Loading services" />;
}
