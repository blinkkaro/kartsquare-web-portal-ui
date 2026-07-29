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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAiOpen } from "@/features/ui/uiSlice";

export default function MainLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
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
            // Nav already reserves the AppBar's exact measured height via its own
            // spacer, so this is just breathing room, not a breakpoint guess.
            mt: 2,
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
