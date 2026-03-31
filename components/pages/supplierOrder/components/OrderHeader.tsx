import React from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Stack,
} from "@mui/material";
import { GridView, List } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useForm } from "react-hook-form";
import Input from "@/components/common/Input";

interface OrderHeaderProps {
  onSearch: (search: string) => void;
  viewMode: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  isMobile: boolean;
  totalCount: number;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({
  onSearch,
  viewMode,
  onViewChange,
  isMobile,
  totalCount,
}) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const searchValue = watch("search");

  React.useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchValue, onSearch]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
        p: 2,
        bgcolor: isDark
          ? COLORS.BACKGROUND.PRIMARY_DARK
          : COLORS.BACKGROUND.PRIMARY_LIGHT,
        borderRadius: "16px",
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        {t("enquiries")}{" "}
        <Box
          component="span"
          sx={{
            bgcolor: COLORS.PURPLE_ALPHA_10,
            color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
            borderRadius: "8px",
            px: 1,
            fontSize: "0.8em",
          }}
        >
          {totalCount || 0}
        </Box>
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        <Box sx={{ width: { xs: "100%", sm: 300 } }}>
          <Input
            name="search"
            control={control}
            placeholder={t("search")}
            startIcon={<SearchIcon sx={{ color: "text.secondary" }} />}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                bgcolor: isDark
                  ? COLORS.BACKGROUND.SECONDARY_DARK
                  : COLORS.BACKGROUND.SECONDARY_LIGHT,
                "& fieldset": { border: "none" },
              },
            }}
          />
        </Box>
        {!isMobile && (
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, nextView) => nextView && onViewChange(nextView)}
            size="small"
            sx={{
              bgcolor: isDark
                ? COLORS.BACKGROUND.SECONDARY_DARK
                : COLORS.BACKGROUND.SECONDARY_LIGHT,
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
      </Stack>
    </Box>
    // <Box
    //   sx={{
    //     display: "flex",
    //     justifyContent: "space-between",
    //     alignItems: "center",
    //     flexWrap: "wrap",
    //     gap: 2,
    //     mb: 4,
    //   }}
    // >
    //   <Typography
    //     variant="h4"
    //     sx={{ fontWeight: 800, color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE }}
    //   >
    //     {t("my_orders")}
    //   </Typography>

    //   <Box
    //     sx={{
    //       display: "flex",
    //       gap: 2,
    //       alignItems: "center",
    //       flex: { xs: 1, sm: "unset" },
    //     }}
    //   >
    //     <TextField
    //       placeholder={t("search_orders")}
    //       size="small"
    //       value={searchQuery}
    //       onChange={(e) => onSearchChange(e.target.value)}
    //       sx={{
    //         "& .MuiOutlinedInput-root": {
    //           borderRadius: "12px",
    //           bgcolor:
    //             theme.palette.mode === "dark"
    //               ? COLORS.BACKGROUND.PRIMARY_DARK
    //               : COLORS.BACKGROUND.PAPER_LIGHT,
    //         },
    //         width: { xs: "100%", sm: "250px" },
    //       }}
    //       InputProps={{
    //         startAdornment: (
    //           <InputAdornment position="start">
    //             <Search sx={{ color: COLORS.TEXT.SECONDARY_LIGHT }} />
    //           </InputAdornment>
    //         ),
    //       }}
    //     />

    //     {!isMobile && (
    //       <ToggleButtonGroup
    //         value={viewMode}
    //         exclusive
    //         onChange={(_, nextView) => nextView && onViewChange(nextView)}
    //         size="small"
    //         sx={{
    //           bgcolor:
    //             theme.palette.mode === "dark"
    //               ? COLORS.BACKGROUND.PRIMARY_DARK
    //               : COLORS.BACKGROUND.PAPER_LIGHT,
    //           borderRadius: "12px",
    //           p: 0.5,
    //           "& .MuiToggleButton-root": {
    //             border: "none",
    //             borderRadius: "8px !important",
    //             px: 1,
    //             "&.Mui-selected": {
    //               bgcolor: COLORS.PURPLE_ALPHA_10,
    //               color: COLORS.PRIMARY_PURPLE,
    //               "&:hover": {
    //                 bgcolor: COLORS.PURPLE_ALPHA_10,
    //               },
    //             },
    //           },
    //         }}
    //       >
    //         <ToggleButton value="list">
    //           <List fontSize="small" />
    //         </ToggleButton>
    //         <ToggleButton value="grid">
    //           <GridView fontSize="small" />
    //         </ToggleButton>
    //       </ToggleButtonGroup>
    //     )}
    //   </Box>
    // </Box>
  );
};

export default OrderHeader;
