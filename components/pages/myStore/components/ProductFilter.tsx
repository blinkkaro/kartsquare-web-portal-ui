import React from "react";
import { Box, Stack, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useForm } from "react-hook-form";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import { COLORS } from "@/constants/colors";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";

interface ProductFilterProps {
  onSearch: (search: string) => void;
  totalCount?: number;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  onSearch,
  totalCount,
}) => {
  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const { t } = useTranslate();

  const searchValue = watch("search");

  React.useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchValue, onSearch]);

  const handleAddProduct = () => {
    router.push("/sup/manageProduct");
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", sm: "center" },
        gap: 2,
        mb: 3,
        p: { xs: 1.5, sm: 2 },
        bgcolor: isDark
          ? COLORS.BACKGROUND.PRIMARY_DARK
          : COLORS.BACKGROUND.PRIMARY_LIGHT,
        borderRadius: "16px",
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        {t("my_store")}{" "}
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

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: "stretch",
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <Box sx={{ width: { xs: "100%", sm: 300 } }}>
          <Input
            name="search"
            control={control}
            placeholder={t("search")}
            startIcon={<SearchIcon sx={{ color: "text.secondary" }} />}
            sx={{
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

        <Button
          onClick={handleAddProduct}
          startIcon={<AddIcon />}
          fullWidth={isMobile}
          sx={{
            whiteSpace: "nowrap",
            height: "45px",
            px: 3,
          }}
        >
          {t("addNewProduct")}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductFilter;
