"use client";
import { Box, Typography, alpha } from "@mui/material";
import { ErrorOutlineRounded } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface Props {
  isVisible: boolean;
  error: string;
}

const ErrorMessage = ({ isVisible, error }: Props) => {
  const theme = useTheme();
  if (!isVisible) return null;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
        bgcolor: alpha(theme.palette.error.main, 0.08),
        borderLeft: `3px solid ${theme.palette.error.main}`,
        color: theme.palette.error.main,
        px: { xs: 1.25, sm: 1.5 },
        py: { xs: 0.75, sm: 1 },
        borderRadius: "8px",
        mb: 2,
      }}
    >
      <ErrorOutlineRounded sx={{ fontSize: "1.1rem", mt: "1px" }} />
      <Typography
        sx={{ fontSize: "0.8rem", lineHeight: 1.4, fontWeight: 500 }}
      >
        {error}
      </Typography>
    </Box>
  );
};

export default ErrorMessage;
