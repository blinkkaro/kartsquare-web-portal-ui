"use client";
import { Box, Modal, Typography } from "@mui/material";
import { Warning } from "@mui/icons-material";
interface Props {
  isVisible: boolean;
  error: string;
}

const ErrorMessage = ({ isVisible, error }: Props) => {
  if (!isVisible) return null;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: "error.light",
        color: "error.contrastText",
        px: { xs: 1.5, sm: 2 },
        py: { xs: 0.75, sm: 1 },
        borderRadius: "8px",
        mb: 2,
      }}
    >
      <Warning sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
      <Typography
        variant="body1"
        sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
      >
        {error}
      </Typography>
    </Box>
  );
};

export default ErrorMessage;
