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
  useTheme,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddIcon from "@mui/icons-material/Add";
import { ProductSummary } from "@/services/product/product.interface";
import { COLORS } from "@/constants/colors";
import EmptyState from "@/components/common/EmptyState";
import { useTranslate } from "@/hooks/useTranslate";
import { useRouter } from "next/navigation";

interface ProductTableProps {
  products: ProductSummary[];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onDelete: (productId: string) => void;
  onUpdateStatus: (productId: string, status: string) => void;
  onUpdateAvailability: (productId: string, isAvailable: boolean) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  onDelete,
  onUpdateStatus,
  onUpdateAvailability,
}) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const observerTarget = useRef(null);
  const router = useRouter();

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

  const handleViewProduct = (productId: string) => {
    router.push(`/sup/product/${productId}`);
  };

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
              {t("skuId")}
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              {t("productName")}
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              {t("category")}
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              {t("subCategory")}
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              {t("stockAvailability")}
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              {t("price")}
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              {t("brand")}
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              {t("status")}
            </TableCell>
            <TableCell
              sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 600 }}
            >
              {t("action")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.product_id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                backgroundColor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
                mb: 1,
                borderBottom: "4px solid " + (isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT),
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
              <TableCell>
                <Switch
                  size="small"
                  checked={product.is_available}
                  onChange={(e) =>
                    onUpdateAvailability(product.product_id, e.target.checked)
                  }
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#4CAF50",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#4CAF50",
                    },
                  }}
                />
              </TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell sx={{ color: COLORS.PRIMARY_BLUE }}>
                {product.brand_name || "-"}
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Switch
                    size="small"
                    checked={product.product_status === "active"}
                    disabled={
                      product.product_status !== "active" &&
                      product.product_status !== "inactive"
                    }
                    onChange={(e) =>
                      onUpdateStatus(
                        product.product_id,
                        e.target.checked ? "active" : "inactive",
                      )
                    }
                  />
                  <Chip
                    label={product.product_status || "Active"}
                    size="small"
                    sx={{
                      bgcolor:
                        product.product_status === "active"
                          ? COLORS.ACCENT_BLUE_BG_DARK
                          : product.product_status === "rejected"
                            ? "error.main"
                            : COLORS.BACKGROUND.SECONDARY_LIGHT,
                      color:
                        product.product_status === "active"
                          ? COLORS.PRIMARY_BLUE
                          : product.product_status === "rejected"
                            ? COLORS.BACKGROUND.SECONDARY_LIGHT
                            : COLORS.TEXT.SECONDARY_LIGHT,
                      fontWeight: 500,
                      textTransform: "capitalize",
                    }}
                  />
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {/* <Switch size="small" checked={product.status === "active"} /> */}
                  <IconButton
                    size="small"
                    onClick={() => handleViewProduct(product.product_id)}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(product.product_id)}
                  >
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
                {t("loadingMore")}
              </TableCell>
            </TableRow>
          )}
          {!hasNextPage && !isLoading && products.length > 0 && (
            <TableRow>
              <TableCell colSpan={11} align="center"></TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div ref={observerTarget} />
    </TableContainer>
  );
};

export default ProductTable;
