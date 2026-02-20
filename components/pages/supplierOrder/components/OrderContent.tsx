import React from "react";
import { Box, Grid, CircularProgress } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import SupplierQuotationCard from "@/components/common/supplierQuotations/SupplierQuotationCard";
import SupplierOrderTable from "./SupplierOrderTable";
import EmptyState from "@/components/common/EmptyState";
import { SupplierQuotation } from "@/services/supplierDashboard/supplierDashoard.interface";

interface OrderContentProps {
  isLoading: boolean;
  quotations?: SupplierQuotation[];
  viewMode: "grid" | "list";
  isMobile: boolean;
  isTablet: boolean;
  onRowClick: (quotation: SupplierQuotation) => void;
}

const OrderContent: React.FC<OrderContentProps> = ({
  isLoading,
  quotations,
  viewMode,
  isMobile,
  isTablet,
  onRowClick,
}) => {
  const { t } = useTranslate();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: COLORS.PRIMARY_PURPLE }} />
      </Box>
    );
  }

  if (!quotations || quotations.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <EmptyState
          titleKey={t("no_orders_found")}
          variant="notFound"
        />
      </Box>
    );
  }

  if (viewMode === "list" && !isMobile) {
    return (
      <SupplierOrderTable quotations={quotations} onRowClick={onRowClick} />
    );
  }

  return (
    <Grid container spacing={3}>
      {quotations.map((quotation) => (
        <Grid
          size={{ xs: 12, sm: 6, md: isTablet ? 6 : 4 }}
          key={quotation.supplier_quotation_id}
        >
          <SupplierQuotationCard
            enquiry={quotation}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default OrderContent;
