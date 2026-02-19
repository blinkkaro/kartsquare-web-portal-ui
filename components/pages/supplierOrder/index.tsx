"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Container,
} from "@mui/material";
import { useSupplierQuotations } from "@/hooks/useSupplierQuotations";
import { COLORS } from "@/constants/colors";
import OrderHeader from "./components/OrderHeader";
import OrderContent from "./components/OrderContent";
import SupplierQuotationDetailsModal from "@/components/common/supplierQuotations/SupplierQuotationDetailsModal";
import { SupplierQuotation } from "@/services/supplierDashboard/supplierDashoard.interface";
import { supplierService } from "@/services/supplier/supplier.service";
import { useQueryClient } from "@tanstack/react-query";

const SupplierOrderPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const isDark = theme.palette.mode === "dark";

  const [viewMode, setViewMode] = useState<"grid" | "list">(
    isMobile ? "grid" : "list",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuotation, setSelectedQuotation] =
    useState<SupplierQuotation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSupplierQuotations({
      search: searchQuery,
      limit: 10,
    });

  const quotations = data?.pages.flatMap((page) => page.quotations) ?? [];

  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      },
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRowClick = async (quotation: SupplierQuotation) => {
    setSelectedQuotation(quotation);
    setIsModalOpen(true);
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: isDark
          ? COLORS.BACKGROUND.SECONDARY_DARK
          : COLORS.BACKGROUND.SECONDARY_LIGHT,
        minHeight: "100vh",
      }}
    >
      <OrderHeader
        onSearch={setSearchQuery}
        viewMode={viewMode}
        onViewChange={setViewMode}
        isMobile={isMobile}
        totalCount={data?.pages[0]?.pagination?.total || 0}
      />

      <OrderContent
        isLoading={isLoading}
        quotations={quotations}
        viewMode={viewMode}
        isMobile={isMobile}
        isTablet={isTablet}
        onRowClick={handleRowClick}
      />

      {/* Intersection Observer Target */}
      <Box
        ref={loaderRef}
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 4,
          visibility: hasNextPage ? "visible" : "hidden",
        }}
      >
        {isFetchingNextPage && (
          <CircularProgress size={24} sx={{ color: COLORS.PRIMARY_PURPLE }} />
        )}
      </Box>

      <SupplierQuotationDetailsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        enquiry={selectedQuotation}
      />
    </Box>
  );
};

export default SupplierOrderPage;
