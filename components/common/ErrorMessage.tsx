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
        px: 2,
        py: 1,
        borderRadius: "8px",
        mb: 2,
      }}
    >
      <Warning />
      <Typography variant="body1">{error}</Typography>
    </Box>
  );
};

export default ErrorMessage;
