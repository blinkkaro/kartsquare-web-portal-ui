import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Avatar,
  useTheme,
  Chip,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import dayjs from "dayjs";
import { SupplierQuotation } from "@/services/supplierDashboard/supplierDashoard.interface";

interface SupplierOrderTableProps {
  quotations: SupplierQuotation[];
  onRowClick: (quotation: SupplierQuotation) => void;
}

const SupplierOrderTable: React.FC<SupplierOrderTableProps> = ({
  quotations,
  onRowClick,
}) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: "calc(100vh - 250px)",
        boxShadow: "none",
        backgroundColor: "transparent",
        backgroundImage: "none",
      }}
    >
      <Table stickyHeader aria-label="supplier quotations table">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                color: COLORS.TEXT.SECONDARY_LIGHT,
                fontWeight: 600,
                bgcolor: "transparent",
              }}
            >
              {t("product")}
            </TableCell>
            <TableCell
              sx={{
                color: COLORS.TEXT.SECONDARY_LIGHT,
                fontWeight: 600,
                bgcolor: "transparent",
              }}
            >
              {t("customer")}
            </TableCell>
            <TableCell
              sx={{
                color: COLORS.TEXT.SECONDARY_LIGHT,
                fontWeight: 600,
                bgcolor: "transparent",
              }}
            >
              {t("quantity")}
            </TableCell>
            <TableCell
              sx={{
                color: COLORS.TEXT.SECONDARY_LIGHT,
                fontWeight: 600,
                bgcolor: "transparent",
              }}
            >
              {t("date")}
            </TableCell>
            <TableCell
              sx={{
                color: COLORS.TEXT.SECONDARY_LIGHT,
                fontWeight: 600,
                bgcolor: "transparent",
              }}
            >
              {t("status")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {quotations.map((quotation) => (
            <TableRow
              key={quotation.supplier_quotation_id}
              onClick={() => onRowClick(quotation)}
              sx={{
                cursor: "pointer",
                "&:last-child td, &:last-child th": { border: 0 },
                backgroundColor: isDark
                  ? COLORS.BACKGROUND.PRIMARY_DARK
                  : COLORS.BACKGROUND.PRIMARY_LIGHT,
                mb: 1,
                borderBottom:
                  "4px solid " +
                  (isDark
                    ? COLORS.BACKGROUND.SECONDARY_DARK
                    : COLORS.BACKGROUND.SECONDARY_LIGHT),
              }}
            >
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={quotation.product_images?.[0] || ""}
                    variant="rounded"
                    sx={{ width: 44, height: 44, borderRadius: "8px" }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      color: isDark
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                    }}
                  >
                    {quotation.product_name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {quotation.customer_name}
                </Typography>
                <Typography
                  variant="caption"
                  color={COLORS.TEXT.SECONDARY_LIGHT}
                >
                  {quotation.country_code} {quotation.phone_number}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {quotation.quantity}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color={COLORS.PRIMARY_PURPLE}
                >
                  {quotation.currency} {quotation.price}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color={COLORS.TEXT.SECONDARY_LIGHT}>
                  {dayjs(quotation.created_at).format("MMM DD, YYYY")}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SupplierOrderTable;
