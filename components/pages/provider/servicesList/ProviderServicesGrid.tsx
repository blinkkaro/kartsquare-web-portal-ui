"use client";
import React from "react";
import { AddRounded, SearchOffRounded, StorefrontRounded } from "@mui/icons-material";
import { Box, Pagination, Skeleton } from "@mui/material";
import Button from "@/components/common/Button";
import EmptyPanel from "@/components/common/list/EmptyPanel";
import ServiceCard from "@/components/ServiceCard";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import type { Service } from "@/services/serviceList/listInteraface";

const GRID_SX = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(3, minmax(0, 1fr))",
    xl: "repeat(4, minmax(0, 1fr))",
  },
  gap: { xs: 2, md: 3 },
} as const;

interface ProviderServicesGridProps {
  services: Service[];
  totalPages: number;
  currentPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  loading?: boolean;
  isProvider: boolean;
  /** What the user typed in the search box, when a search is active. */
  searchTerm?: string;
  /** A status chip other than "All" is selected. */
  filtered?: boolean;
  onClearSearch?: () => void;
  onAdd?: () => void;
}

/** Cards sit on the same grid as the loading skeleton, so nothing jumps when data arrives. */
const SkeletonGrid = () => (
  <Box sx={GRID_SX} aria-hidden>
    {Array.from({ length: 6 }).map((_, i) => (
      <Box
        key={i}
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
          bgcolor: COLORS.WHITE,
        }}
      >
        <Skeleton variant="rectangular" sx={{ aspectRatio: "4 / 3", height: "auto" }} />
        <Box sx={{ p: 2 }}>
          <Skeleton width="70%" />
          <Skeleton width="45%" />
        </Box>
      </Box>
    ))}
  </Box>
);

const ProviderServicesGrid = ({
  services,
  totalPages,
  currentPage,
  onPageChange,
  loading,
  isProvider,
  searchTerm,
  filtered,
  onClearSearch,
  onAdd,
}: ProviderServicesGridProps) => {
  const { t } = useTranslate();

  if (loading) return <SkeletonGrid />;

  if (services.length === 0) {
    if (searchTerm) {
      return (
        <EmptyPanel
          icon={<SearchOffRounded sx={{ fontSize: 36 }} />}
          title={t("sv_none_title", { query: searchTerm })}
          description={t("sv_none_desc")}
          action={
            <Button variant="outlined" onClick={onClearSearch} sx={{ minHeight: 44, px: 3 }}>
              {t("sv_none_cta")}
            </Button>
          }
        />
      );
    }
    if (filtered) {
      return (
        <EmptyPanel
          icon={<StorefrontRounded sx={{ fontSize: 36 }} />}
          title={t("sv_group_empty")}
          description={t("sv_none_desc")}
        />
      );
    }
    return (
      <EmptyPanel
        icon={<StorefrontRounded sx={{ fontSize: 36 }} />}
        title={isProvider ? t("sv_empty_title") : t("no_services_found")}
        description={isProvider ? t("sv_empty_desc") : t("no_services_found_description")}
        action={
          isProvider && onAdd ? (
            <Button onClick={onAdd} startIcon={<AddRounded />} sx={{ minHeight: 44, px: 3, mt: 1 }}>
              {t("sv_add")}
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <>
      <Box sx={GRID_SX}>
        {services.map((service) => (
          <ServiceCard key={service.service_id} service={service} />
        ))}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 3, sm: 4 } }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": { minWidth: 44, height: 44, fontWeight: 600 },
              "& .Mui-selected": {
                bgcolor: `${COLORS.PRIMARY_PURPLE} !important`,
                color: COLORS.WHITE,
              },
            }}
          />
        </Box>
      )}
    </>
  );
};

export default ProviderServicesGrid;
