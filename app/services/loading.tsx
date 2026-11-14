import { Box, Skeleton } from "@mui/material";

/**
 * Shown the instant a service link is clicked, while the page renders on the server.
 * Without it the old page just sits there and the tap feels ignored.
 */
export default function ServiceLoading() {
  return (
    <Box
      aria-busy
      aria-label="Loading service"
      sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 3 }, py: { xs: 2, md: 4 } }}
    >
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
    </Box>
  );
}
