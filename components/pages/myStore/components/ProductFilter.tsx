import React from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
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
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
        p: 2,
        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
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

      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ width: 300 }}>
          <Input
            name="search"
            control={control}
            placeholder={t("search")}
            startIcon={<SearchIcon sx={{ color: "text.secondary" }} />}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
                "& fieldset": { border: "none" },
              },
            }}
          />
        </Box>
        {/* <Button
          variant="outlined"
          sx={{
            minWidth: "40px",
            width: "40px",
            height: "40px",
            p: 0,
            borderRadius: "50%",
            border: `1px solid ${COLORS.BORDER.DEFAULT_LIGHT}`,
          }}
        >
          <FilterListIcon />
        </Button> */}

        <Button onClick={handleAddProduct} startIcon={<AddIcon />}>{t("addNewProduct")}</Button>
      </Stack>
    </Box>
  );
};

export default ProductFilter;
