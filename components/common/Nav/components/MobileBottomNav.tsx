import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Box, styled } from "@mui/material";
import { useReducedMotion } from "framer-motion";
import { COLORS } from "../../../../constants/colors";
import { type NavItem } from "../../../../constants/navRoutes";

/**
 * Height of the dock, excluding the gap below it and the device safe-area inset.
 * A 48px tab (icon over a 12px label) plus 4px of padding either side.
 */
export const MOBILE_NAV_HEIGHT = 56;

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Which tab was open on the page you came from. Each page mounts its own dock, so this remembers it across pages. */
let lastActive: string | null = null;

/** Publishes the dock's height as --mobile-nav-h so other fixed UI (the AI button, back-to-top) can sit above it. */
function usePublishHeight() {
  useEffect(() => {
    document.documentElement.style.setProperty("--mobile-nav-h", `${MOBILE_NAV_HEIGHT}px`);
    return () => {
      document.documentElement.style.removeProperty("--mobile-nav-h");
    };
  }, []);
}

/**
 * A floating dock, lifted off the bottom edge. Every tab shows its icon and its name, so each link is easy
 * to find. The current tab gets a violet pill behind its icon, a violet label and a "tubelight" lamp
 * glowing on the dock's top edge. Pressing a tab dips it. Nothing loops.
 */
const Dock = styled("nav")(({ theme }) => {
  const dark = theme.palette.mode === "dark";
  return {
    position: "fixed",
    left: 12,
    right: 12,
    // fixed + left/right + a max width: auto margins centre it on tablets
    margin: "0 auto",
    maxWidth: 520,
    bottom: "calc(10px + env(safe-area-inset-bottom, 0px))",
    zIndex: 1000,
    display: "flex",
    alignItems: "stretch",
    height: MOBILE_NAV_HEIGHT,
    padding: 4,
    boxSizing: "border-box",
    borderRadius: 24,
    backgroundColor: dark ? "rgba(18, 15, 28, 0.96)" : "rgba(255, 255, 255, 0.96)",
    backdropFilter: "blur(16px) saturate(180%)",
    WebkitBackdropFilter: "blur(16px) saturate(180%)",
    border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(15, 12, 30, 0.08)"}`,
    boxShadow: dark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 10px 28px rgba(42, 13, 115, 0.2)",
  };
});

const Tab = styled(Link)(({ theme }) => {
  const dark = theme.palette.mode === "dark";
  return {
    position: "relative",
    flex: "1 1 0",
    minWidth: 0,
    height: 48,
    borderRadius: 18,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    textDecoration: "none",
    color: dark ? "rgba(255,255,255,0.78)" : COLORS.TEXT.SECONDARY_LIGHT,
    WebkitTapHighlightColor: "transparent",
    transition: `color 200ms ease, transform 120ms ease`,
    "&:active": { transform: "scale(0.93)" },
    "&:focus-visible": { outline: `3px solid ${COLORS.PURPLE_ALPHA_30}`, outlineOffset: 1 },
    // The icon sits in a pill that fills in on the open tab.
    "& .pill": {
      width: 48,
      height: 26,
      borderRadius: 13,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      transform: "scaleX(0.7)",
      transition: `background-color 220ms ease, transform 320ms ${EASE}`,
    },
    "& .pill .icon": { display: "inline-flex", transform: "scaleX(1.4286)", transition: `transform 320ms ${EASE}` }, // undoes the pill's scale so the icon is never squashed
    "& .MuiSvgIcon-root": { fontSize: "1.4rem" },
    "& .label": {
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontSize: "0.75rem", // 12px: the smallest label size
      fontWeight: 600,
      lineHeight: 1.1,
    },
    // The open tab: violet pill, violet icon, bold violet label.
    "&.open": { color: dark ? "#d2bcff" : COLORS.PRIMARY_PURPLE },
    "&.open .pill": { backgroundColor: dark ? "rgba(130, 72, 247, 0.32)" : COLORS.PURPLE_ALPHA_10, transform: "scaleX(1)" },
    "&.open .pill .icon": { transform: "scaleX(1)" },
    "&.open .label": { fontWeight: 700 },
    // The tubelight: a short lamp on the dock's top edge, with a soft glow under it.
    "&::before": {
      content: '""',
      position: "absolute",
      top: -4,
      left: "50%",
      width: 24,
      height: 3,
      borderRadius: "0 0 3px 3px",
      transform: "translateX(-50%) scaleX(0.4)",
      opacity: 0,
      backgroundColor: COLORS.PRIMARY_PURPLE,
      boxShadow: `0 4px 14px 2px ${COLORS.PURPLE_ALPHA_30}`,
      transition: `opacity 220ms ease, transform 320ms ${EASE}`,
    },
    "&.open::before": { opacity: 1, transform: "translateX(-50%) scaleX(1)" },
    "@media (prefers-reduced-motion: reduce)": {
      transition: "none",
      "&:active": { transform: "none" },
      "& .pill, & .pill .icon, &::before": { transition: "none" },
    },
  };
});

interface MobileBottomNavProps {
  items: NavItem[];
  currentPath: string;
}

export const isActivePath = (currentPath: string, href: string) =>
  href === "/" ? currentPath === "/" : currentPath === href || currentPath.startsWith(`${href}/`);

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ items, currentPath }) => {
  const reduce = useReducedMotion() === true;
  usePublishHeight();

  const active = items.find((item) => isActivePath(currentPath, item.href))?.href ?? null;
  // On a new page the dock is new too: start with the tab that was open on the last page, then switch,
  // so the old pill fades out and the new one fills in instead of the dock just appearing in its final state.
  const startOpen = !reduce && lastActive && items.some((i) => i.href === lastActive) ? lastActive : active;
  const [open, setOpen] = useState<string | null>(startOpen);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(active));
    lastActive = active;
    return () => cancelAnimationFrame(frame);
  }, [active]);

  return (
    <Dock aria-label="Primary">
      {items.map((item) => {
        const isActive = item.href === active;
        return (
          <Tab
            key={item.label}
            href={item.href}
            className={open === item.href ? "open" : ""}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            // a short tick on tap, where the device has one
            onClick={() => {
              if (!reduce && typeof navigator !== "undefined") navigator.vibrate?.(8);
            }}
          >
            <Box component="span" className="pill">
              <Box component="span" className="icon">
                {React.cloneElement(item.icon as React.ReactElement<{ sx?: object }>, { sx: { fontSize: "1.4rem" } })}
              </Box>
            </Box>
            <Box component="span" className="label">
              {item.label}
            </Box>
          </Tab>
        );
      })}
    </Dock>
  );
};

export default MobileBottomNav;
