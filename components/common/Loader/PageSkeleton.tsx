import React from "react";
import { Box, Skeleton } from "@mui/material";
import MainLayout from "@/app/mainLayout";

/**
 * The instant placeholder a route's `loading.tsx` shows while its page renders on the server.
 * It sits inside the normal shell (header, bottom nav), so a tap swaps only the content area
 * instead of blanking the whole screen. Shapes roughly match the page so nothing jumps.
 */
export type PageSkeletonVariant = "detail" | "list" | "profile";

interface PageSkeletonProps {
  variant: PageSkeletonVariant;
  /** Read by screen readers, e.g. "Loading service". */
  label: string;
}

function DetailSkeleton() {
  return (
    <>
      <Skeleton
        variant="rounded"
        sx={{ width: "100%", height: { xs: 220, md: 360 }, borderRadius: "20px" }}
      />
      <Skeleton variant="text" sx={{ fontSize: "1.8rem", width: "70%", mt: 2 }} />
      <Skeleton variant="text" sx={{ width: "40%" }} />
      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <Skeleton variant="rounded" width={110} height={36} sx={{ borderRadius: 999 }} />
        <Skeleton variant="rounded" width={110} height={36} sx={{ borderRadius: 999 }} />
      </Box>
      <Skeleton
        variant="rounded"
        sx={{ width: "100%", height: 140, mt: 3, borderRadius: "16px" }}
      />
    </>
  );
}

function ListSkeleton() {
  return (
    <>
      <Skeleton variant="text" sx={{ fontSize: "1.8rem", width: { xs: "80%", md: "45%" } }} />
      <Skeleton variant="text" sx={{ width: { xs: "60%", md: "30%" }, mb: 2 }} />
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
        }}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <Box key={i}>
            <Skeleton variant="rounded" sx={{ width: "100%", height: 160, borderRadius: "16px" }} />
            <Skeleton variant="text" sx={{ width: "75%", mt: 1 }} />
            <Skeleton variant="text" sx={{ width: "50%" }} />
          </Box>
        ))}
      </Box>
    </>
  );
}

function ProfileSkeleton() {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Skeleton variant="circular" width={88} height={88} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: "1.6rem", width: "60%" }} />
          <Skeleton variant="text" sx={{ width: "40%" }} />
        </Box>
      </Box>
      <Skeleton variant="rounded" sx={{ width: "100%", height: 44, mt: 3, borderRadius: "12px" }} />
      <Box
        sx={{
          display: "grid",
          gap: 2,
          mt: 3,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
        }}
      >
        <Skeleton variant="rounded" sx={{ height: 160, borderRadius: "16px" }} />
        <Skeleton variant="rounded" sx={{ height: 160, borderRadius: "16px" }} />
      </Box>
    </>
  );
}

const VARIANTS: Record<PageSkeletonVariant, () => React.ReactElement> = {
  detail: DetailSkeleton,
  list: ListSkeleton,
  profile: ProfileSkeleton,
};

export default function PageSkeleton({ variant, label }: PageSkeletonProps) {
  const Body = VARIANTS[variant];
  return (
    <MainLayout>
      <Box
        role="status"
        aria-busy
        aria-label={label}
        sx={{
          maxWidth: 1100,
          mx: "auto",
          width: "100%",
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 4 },
        }}
      >
        <Body />
      </Box>
    </MainLayout>
  );
}
