"use client";
import React from "react";
import { Box, useTheme } from "@mui/material";
import Nav from "@/components/common/Nav";
import Footer from "@/components/common/Footer";
import ProfileDrawer from "@/components/common/ProfileDrawer";
import Ai from "@/components/common/Ai";
import AIBotton from "@/components/common/Ai/AIBotton";
import LoginModal from "@/components/common/loginModel";
import { COLORS } from "@/constants/colors";

export default function MainLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const [aiOpen, setAiOpen] = React.useState(false);

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          px: { xs: 0, sm: 1.5, md: 3, lg: 4, xl: 5 },
          backgroundColor:
            theme.palette.mode === "dark"
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.PAPER_LIGHT,
          pb: { xs: "5rem", md: "0" },
        }}
      >
        <Nav />
        <Box
          component="main"
          sx={{
            flex: 1,
            mx: "auto",
            width: "100%",
            px: { xs: 1, md: 0 },
            mt: { xs: 10, sm: 12, md: 10, lg: 12 },
            backgroundColor:
              theme.palette.mode === "dark"
                ? COLORS.BACKGROUND.PAPER_DARK
                : COLORS.BACKGROUND.PAPER_LIGHT,
          }}
        >
          {children}
          <AIBotton setOpen={setAiOpen} />
        </Box>
        <ProfileDrawer />
        <Ai open={aiOpen} onClose={() => setAiOpen(false)} />
      </Box>
      <LoginModal />
      <Footer />
    </>
  );
}
