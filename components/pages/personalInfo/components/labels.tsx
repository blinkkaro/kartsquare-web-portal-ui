import { Box, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { COLORS } from "@/constants/colors";
import Image from "next/image";
import { useTranslate } from "@/hooks/useTranslate";

interface LabelsProps {
  label: string;
  description: string;
  verified?: boolean;
}

const Labels = ({ label, description, verified }: LabelsProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();

  return (
    <Box sx={{ py: "0.5rem" }}>
      <Typography
        variant="body2"
        sx={{
          color: isDark
            ? COLORS.TEXT.SECONDARY_DARK
            : COLORS.TEXT.SECONDARY_LIGHT,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
          wordBreak: "break-word",
        }}
      >
        {description || "-"}
      </Typography>
      {verified && (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            bgcolor: "#E8EAF6", // Light indigo/blue background like screenshot
            color: "#3F51B5", // Text color to match Verified
            px: 1,
            py: 0.2,
            borderRadius: "12px",
            mt: 0.5,
          }}
        >
          <Image src="/success.svg" alt="verified" width={14} height={14} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.5px",
            }}
          >
            {t("verified")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Labels;
