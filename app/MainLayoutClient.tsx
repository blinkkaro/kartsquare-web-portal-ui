"use client";
import React, { useEffect } from "react";
import Nav from "@/components/common/Nav";
import Footer from "@/components/common/Footer";
import { Box, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";
import ProfileDrawer from "@/components/common/ProfileDrawer";
import Ai from "@/components/common/Ai";
import AIBotton from "@/components/common/Ai/AIBotton";
import LoginModal from "@/components/common/loginModel";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAiOpen } from "@/features/ui/uiSlice";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const aiOpen = useAppSelector((state) => state.ui.isAiOpen);

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          // Responsive padding
          px: { xs: 0, sm: 1.5, md: 1, lg: 2, xl: 3 },
          pt: { xs: 0, sm: 1.5, md: 1, lg: 3, xl: 3 },

          // pb: { xs: 4, md: 6 },
          backgroundColor:
            theme.palette.mode === "dark"
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.PAPER_LIGHT,
          // more breathing room at bottom on mobile
          pb: { xs: "5rem", md: "0" },
        }}
      >
        <Nav />

        {/* Main content wrapper - grows to fill available space */}
        <Box
          component="main"
          sx={{
            flex: 1,
            // maxWidth: { lg: "1500px", xl: "2000px" },
            mx: "auto",
            width: "100%",
            px: { xs: 1, md: 0 },
            // Nav already reserves the AppBar's exact measured height via its own
            // spacer, so this is just breathing room, not a breakpoint guess.

            backgroundColor:
              theme.palette.mode === "dark"
                ? COLORS.BACKGROUND.PAPER_DARK
                : COLORS.BACKGROUND.PAPER_LIGHT,
          }}
        >
          {children}
          <AIBotton setOpen={(open) => dispatch(setAiOpen(open))} />
        </Box>
        <ProfileDrawer />
        <Ai open={aiOpen} onClose={() => dispatch(setAiOpen(false))} />
      </Box>
      <LoginModal />
      <Footer />
    </>
  );
}
