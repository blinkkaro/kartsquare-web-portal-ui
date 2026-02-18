import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import { Search, GridView, List } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface OrderHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  isMobile: boolean;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewChange,
  isMobile,
}) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        mb: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE }}
      >
        {t("my_orders")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          flex: { xs: 1, sm: "unset" },
        }}
      >
        <TextField
          placeholder={t("search_orders")}
          size="small"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor:
                theme.palette.mode === "dark"
                  ? COLORS.BACKGROUND.PRIMARY_DARK
                  : COLORS.BACKGROUND.PAPER_LIGHT,
            },
            width: { xs: "100%", sm: "250px" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: COLORS.TEXT.SECONDARY_LIGHT }} />
              </InputAdornment>
            ),
          }}
        />

        {!isMobile && (
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, nextView) => nextView && onViewChange(nextView)}
            size="small"
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? COLORS.BACKGROUND.PRIMARY_DARK
                  : COLORS.BACKGROUND.PAPER_LIGHT,
              borderRadius: "12px",
              p: 0.5,
              "& .MuiToggleButton-root": {
                border: "none",
                borderRadius: "8px !important",
                px: 1,
                "&.Mui-selected": {
                  bgcolor: COLORS.PURPLE_ALPHA_10,
                  color: COLORS.PRIMARY_PURPLE,
                  "&:hover": {
                    bgcolor: COLORS.PURPLE_ALPHA_10,
                  },
                },
              },
            }}
          >
            <ToggleButton value="list">
              <List fontSize="small" />
            </ToggleButton>
            <ToggleButton value="grid">
              <GridView fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>
    </Box>
  );
};

export default OrderHeader;
