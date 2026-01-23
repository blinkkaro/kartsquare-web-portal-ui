import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import { Visibility, PlayArrow } from "@mui/icons-material";
import { UserBooking } from "../../../../services/booking/bookingInterface";
import { english } from "../../../../features/i18n/en";

interface ProviderBookingActionButtonsProps {
    booking: UserBooking;
    tabName: string;
    onViewDetails: (booking: UserBooking) => void;
}

const ProviderBookingActionButtons: React.FC<ProviderBookingActionButtonsProps> = ({ booking, tabName, onViewDetails }) => {
    if (tabName === english.upcoming) {
        return (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<PlayArrow />}
                    sx={{ bgcolor: "#4F46E5", color: "white", textTransform: "none", borderRadius: "20px", px: 2, fontSize: "0.75rem", fontWeight: 600, "&:hover": { bgcolor: "#4338ca" } }}
                >
                    {english.start}
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    sx={{ bgcolor: "#1F2937", color: "white", textTransform: "none", borderRadius: "20px", px: 2, fontSize: "0.75rem", fontWeight: 600, "&:hover": { bgcolor: "#111827" } }}
                >
                    {english.cancel}
                </Button>
                <IconButton size="small" onClick={() => onViewDetails(booking)}>
                    <Visibility fontSize="small" />
                </IconButton>
            </Box>
        );
    }

    // Completed and Cancelled tabs only have View button
    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton size="small" onClick={() => onViewDetails(booking)}>
                <Visibility fontSize="small" />
            </IconButton>
        </Box>
    );
};

export default ProviderBookingActionButtons;
