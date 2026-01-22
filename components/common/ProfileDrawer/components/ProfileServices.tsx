import React from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { Box, CircularProgress, Typography, Grid } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useProviderServices } from "@/hooks/useProviderProfile";
import ServiceCard from "@/components/ServiceCard";

interface ProfileServicesProps {
  userId: string;
}

export default function ProfileServices({ userId }: ProfileServicesProps) {
  const { t } = useTranslate();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useProviderServices(userId);

  const allServices = data?.pages.flatMap((page) => page.services) || [];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress sx={{ color: COLORS.PRIMARY_PURPLE }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">{t("failedToLoadServices")}</Typography>
      </Box>
    );
  }

  if (!isLoading && allServices.length === 0) {
    return (
      <Box
        sx={{ textAlign: "center", mt: 4, color: COLORS.TEXT.SECONDARY_LIGHT }}
      >
        <Typography>{t("noServicesFound")}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {allServices.map((service, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 6 }}
            key={`${service.service_id}-${index}`}
          >
            <ServiceCard service={service as any} />
          </Grid>
        ))}
      </Grid>

      {/* Load More Trigger/Spinner could be added here similar to posts */}
      {isFetchingNextPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress size={24} sx={{ color: COLORS.PRIMARY_PURPLE }} />
        </Box>
      )}
    </Box>
  );
}
