"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ProductFilter from "./components/ProductFilter";
import ProductTable from "./components/ProductTable";
import { useSupplierProducts } from "@/hooks/useProducts";
import { COLORS } from "@/constants/colors";

function MyStoreView() {
  const [search, setSearch] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSupplierProducts({ search });

  // Flatten the pages into a single array of products
  const products = data?.pages.flatMap((page) => page.products) || [];

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: COLORS.BACKGROUND.SECONDARY_LIGHT,
        minHeight: "100vh",
      }}
    >
      <ProductFilter
        onSearch={setSearch}
        totalCount={data?.pages[0]?.pagination?.total}
      />
      <ProductTable
        products={products}
        isLoading={isLoading}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </Box>
  );
}

export default MyStoreView;
