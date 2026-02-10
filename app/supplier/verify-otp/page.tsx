import React from "react";
import OTPVerification from "@/components/supplier/OTPVerification";
import { Box, Container } from "@mui/material";
import Nav from "@/components/common/Nav";

export default function SupplierOTPPage() {
    return (
        <>
            <Nav />
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f5f5f5",
                    py: 4,
                    mt: { xs: 7, md: 8 }
                }}
            >
                <Container maxWidth="sm">
                    <OTPVerification />
                </Container>
            </Box>
        </>
    );
}
