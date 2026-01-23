import React from "react";
import { Box, Pagination, useTheme } from "@mui/material";
import { COLORS } from "../../../constants/colors";

interface ServicesPaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (_event: React.ChangeEvent<unknown>, value: number) => void;
}

const ServicesPagination: React.FC<ServicesPaginationProps> = ({
    totalPages,
    currentPage,
    onPageChange,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    if (totalPages <= 1) return null;

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 3, sm: 4 }, mb: { xs: 2, sm: 0 } }}>
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={onPageChange}
                color="primary"
                size={{ xs: "small", sm: "medium", md: "large" }}
                sx={{
                    "& .MuiPaginationItem-root": {
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                    },
                    "& .Mui-selected": {
                        bgcolor: `${COLORS.PRIMARY_PURPLE} !important`,
                        color: "white",
                    },
                }}
            />
        </Box>
    );
};

export default ServicesPagination;
