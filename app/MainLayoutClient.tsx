"use client";
import React from "react";
import Link from "next/link";
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
  flushTop = false,
}: {
  children: React.ReactNode;
  /** Drop the gap under the header on phones, for pages that run edge to edge there. */
  flushTop?: boolean;
}) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const aiOpen = useAppSelector((state) => state.ui.isAiOpen);

  return (
    <>
      <Box
        data-main-shell
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          px: 0,
          backgroundColor:
            theme.palette.mode === "dark"
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.PAPER_LIGHT,
          // The bottom nav shows below `lg` (phones + tablets): reserve its height plus the safe area
          pb: { xs: "calc(6rem + env(safe-area-inset-bottom, 0px))", lg: "0" },
        }}
      >
        <Nav />
        <Box
          component="main"
          sx={{
            flex: 1,
            mx: "auto",
            width: "100%",
            px: 0,
            // Nav already reserves the AppBar's exact measured height via its own
            // spacer, so this is just breathing room, not a breakpoint guess.
            mt: flushTop ? { xs: 0, sm: 2 } : 2,
            backgroundColor:
              theme.palette.mode === "dark"
                ? COLORS.BACKGROUND.PAPER_DARK
                : COLORS.BACKGROUND.PAPER_LIGHT,
          }}
        >
          {children}
          <AIBotton setOpen={(open) => dispatch(setAiOpen(open))} />
        </Box>
        {/* Mobile-only slim footer: the full footer is md+ only. Lives inside the shell so its
            bottom padding keeps it clear of the fixed bottom nav. */}
        <Box
          component="nav"
          aria-label="Footer"
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
            alignItems: "center",
            gap: 0.75,
            pt: 3,
            pb: 1,
            fontSize: "0.75rem",
            color: "text.secondary",
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 2, rowGap: 0.5 }}>
            {[
              { label: "About us", href: "/about-us" },
              { label: "Contact", href: "/contact-us" },
              { label: "Privacy", href: "/privacy-policy" },
              { label: "Terms", href: "/terms-conditions" },
            ].map((l) => (
              <Box
                key={l.href}
                component={Link}
                href={l.href}
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  fontWeight: 600,
                  minHeight: 32,
                  display: "inline-flex",
                  alignItems: "center",
                  "&:active": { color: COLORS.PRIMARY_PURPLE },
                }}
              >
                {l.label}
              </Box>
            ))}
          </Box>
          <Box component="span">© {new Date().getFullYear()} Kartsquare</Box>
        </Box>
        <ProfileDrawer />
        <Ai open={aiOpen} onClose={() => dispatch(setAiOpen(false))} />
      </Box>
      <LoginModal />
      {/* Footer is desktop/tablet only; mobile uses the bottom nav. Hidden inside the native app. */}
      <Box data-native-hide sx={{ display: { xs: "none", md: "block" } }}>
        <Footer />
      </Box>
    </>
  );
}
