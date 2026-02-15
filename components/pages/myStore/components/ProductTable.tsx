import React, { useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Switch,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddIcon from "@mui/icons-material/Add";
import { ProductSummary } from "@/services/product/product.interface";
import { COLORS } from "@/constants/colors";
import EmptyState from "@/components/common/EmptyState";
import { useTranslate } from "@/hooks/useTranslate";

interface ProductTableProps {
  products: ProductSummary[];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const { t } = useTranslate();
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!isLoading && products.length === 0) {
    return (
      <EmptyState
        titleKey="noProductsFound"
        descriptionKey="noProductsFoundDescription"
        variant="notFound"
      />
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: "calc(100vh - 250px)",
        boxShadow: "none",
        backgroundColor: "transparent",
      }}
    >
      <Table stickyHeader aria-label="product table">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              SKU ID
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              PRODUCT NAME
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              CATEGORY
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              SUB CATEGORY
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              STOCK AVAILABILITY
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              PRICE
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              BRAND
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              STATUS
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              ACTION
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.product_id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                backgroundColor: COLORS.BACKGROUND.PRIMARY_LIGHT,
                mb: 1,
                borderBottom: "4px solid " + COLORS.BACKGROUND.SECONDARY_LIGHT,
              }}
            >
              <TableCell>{product.sku_number || "N/A"}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={product.product_images?.[0] || ""}
                    variant="rounded"
                    sx={{ width: 40, height: 40 }}
                  />
                  <Typography variant="body2" fontWeight={500}>
                    {product.product_name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{product.category_name || "-"}</TableCell>
              <TableCell>{product.sub_category_name || "-"}</TableCell>
              <TableCell>{product.is_available ? "Yes" : "No"}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell sx={{ color: COLORS.PRIMARY_BLUE }}>
                {product.brand_name || "-"}
              </TableCell>
              <TableCell>
                <Chip
                  label={product.product_status || "Active"}
                  size="small"
                  sx={{
                    bgcolor:
                      product.product_status === "active"
                        ? "#e6f4ff"
                        : "#fff1f0",
                    color:
                      product.product_status === "active"
                        ? "#1677ff"
                        : "#ff4d4f",
                    fontWeight: 500,
                  }}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {/* <Switch size="small" checked={product.status === "active"} /> */}
                  <IconButton size="small">
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {/* Loading indicator for infinite scroll */}
          {isFetchingNextPage && (
            <TableRow>
              <TableCell colSpan={11} align="center">
                Loading more...
              </TableCell>
            </TableRow>
          )}
          {!hasNextPage && !isLoading && products.length > 0 && (
            <TableRow>
              <TableCell colSpan={11} align="center">
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div ref={observerTarget} />
    </TableContainer>
  );
};

export default ProductTable;
