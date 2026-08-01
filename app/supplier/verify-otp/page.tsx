import React, { Suspense } from "react";
import OTPVerification from "@/components/supplier/OTPVerification";
import { Box, Container } from "@mui/material";
import Nav from "@/components/common/Nav";
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata = seoAuth({
  title: "Verify OTP",
  description:
    "Enter the one-time code sent to your phone or email to verify your KartSquare supplier account.",
});

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
          mt: { xs: 7, md: 8 },
        }}
      >
        <Container maxWidth="sm">
          <Suspense fallback={null}>
            <OTPVerification />
          </Suspense>
        </Container>
      </Box>
    </>
  );
}
