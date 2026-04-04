import React from "react";
import LoginForm from "@/components/supplier/LoginForm";
import { Box, Container } from "@mui/material";
import Nav from "@/components/common/Nav";
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata = seoAuth({
  title: "Supplier login",
  description:
    "Sign in to your KartSquare supplier account to manage products, orders, and your storefront.",
});

export default function SupplierLoginPage() {
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
          <LoginForm />
        </Container>
      </Box>
    </>
  );
}
