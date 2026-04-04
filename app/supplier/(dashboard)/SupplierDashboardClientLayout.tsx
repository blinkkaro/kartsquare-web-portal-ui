"use client";
import React from "react";
import SupplierGuard from "@/components/supplier/SupplierGuard";
import Nav from "@/components/common/Nav";
import { Box } from "@mui/material";

export default function SupplierDashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupplierGuard requireComplete={true}>
      <Nav />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          pt: { xs: 8, md: 10 },
          pb: 4,
          px: { xs: 2, md: 4 },
        }}
      >
        {children}
      </Box>
    </SupplierGuard>
  );
}
