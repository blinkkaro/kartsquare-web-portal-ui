import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import { Visibility, NearMe } from "@mui/icons-material";
import { UserBooking } from "../../../services/booking/bookingInterface";
import { english } from "../../../features/i18n/en";

interface BookingActionButtonsProps {
  booking: UserBooking;
  tabName: string;
  onViewDetails: (booking: UserBooking) => void;
}

const BookingActionButtons: React.FC<BookingActionButtonsProps> = ({
  booking,
  tabName,
  onViewDetails,
}) => {
  if (tabName === english.upcoming) {
    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {/* <Button
                    variant="contained"
                    size="small"
                    sx={{ bgcolor: "#4F46E5", color: "white", textTransform: "none", borderRadius: "20px", px: 2, fontSize: "0.75rem", fontWeight: 600, "&:hover": { bgcolor: "#4338ca" } }}
                >
                    {english.reschedule}
                </Button> */}
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "#1F2937",
            color: "white",
            textTransform: "none",
            borderRadius: "20px",
            px: 2,
            fontSize: "0.75rem",
            fontWeight: 600,
            "&:hover": { bgcolor: "#111827" },
          }}
        >
          {english.cancel}
        </Button>
        <IconButton size="small" onClick={() => onViewDetails(booking)}>
          <Visibility fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  if (tabName === english.in_progress) {
    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton size="small" sx={{ bgcolor: "#EFF6FF", color: "#3B82F6" }}>
          <NearMe fontSize="small" />
        </IconButton>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "#1F2937",
            color: "white",
            textTransform: "none",
            borderRadius: "20px",
            px: 2,
            fontSize: "0.75rem",
            fontWeight: 600,
            "&:hover": { bgcolor: "#111827" },
          }}
        >
          {english.cancel}
        </Button>
        <IconButton size="small" onClick={() => onViewDetails(booking)}>
          <Visibility fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  if (tabName === english.completed) {
    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "#1F2937",
            color: "white",
            textTransform: "none",
            borderRadius: "20px",
            px: 2,
            fontSize: "0.75rem",
            fontWeight: 600,
            "&:hover": { bgcolor: "#111827" },
          }}
        >
          {english.request_refund}
        </Button>
        <IconButton size="small" onClick={() => onViewDetails(booking)}>
          <Visibility fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  if (tabName === english.cancelled) {
    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton size="small" onClick={() => onViewDetails(booking)}>
          <Visibility fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  return null;
};

export default BookingActionButtons;
