import React, { useEffect, useState } from "react";
import { Box, styled, useTheme } from "@mui/material";
import Link from "next/link";
import { COLORS } from "../../../../constants/colors";
import GradientIcon from "../../GradientIcon";
import { NavItem } from "../../../../constants/navRoutes";

/** Height of the bar's content area, excluding the device safe-area inset. */
export const MOBILE_NAV_HEIGHT = 60;
/** Height while the user is scrolling down (icons only). */
export const MOBILE_NAV_COMPACT_HEIGHT = 42;

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const SCROLL_THRESHOLD = 4;

/**
 * Uber-style collapsing bar: shrinks while the user scrolls down (more room for
 * content), grows back on any scroll up and whenever the page is at the top.
 * Also publishes its live height as --mobile-nav-h so other fixed UI (the AI
 * button) can sit just above it.
 */
function useCompactOnScrollDown(): boolean {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    // Pages differ in what scrolls (the window, or a full-height inner container),
    // so listen in the capture phase and track each vertical scroller separately.
    const lastTop = new WeakMap<object, number>();
    // Seed with where the page already is; inner scrollers start from the top.
    lastTop.set(window, window.scrollY);
    let ticking = false;

    const isPageScroller = (t: EventTarget | null): t is Document | HTMLElement => {
      if (t === document || t === document.documentElement || t === document.body) return true;
      if (!(t instanceof HTMLElement)) return false;
      // Ignore small scrollers (carousels, chat lists) and anything inside a modal/drawer.
      if (t.clientHeight < window.innerHeight * 0.5) return false;
      return !t.closest('[role="dialog"], .MuiModal-root, .MuiDrawer-root');
    };

    const onScroll = (e: Event) => {
      const target = e.target;
      if (!isPageScroller(target) || ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        const isDoc = target === document || target === document.documentElement || target === document.body;
        const y = Math.max(0, isDoc ? window.scrollY || document.documentElement.scrollTop : (target as HTMLElement).scrollTop);
        const key = isDoc ? window : (target as HTMLElement);
        const last = lastTop.get(key) ?? 0;
        const dy = y - last;
        if (y < 24) {
          setCompact(false);
          lastTop.set(key, y);
        } else if (dy > SCROLL_THRESHOLD) {
          setCompact(true);
          lastTop.set(key, y);
        } else if (dy < -SCROLL_THRESHOLD) {
          setCompact(false);
          lastTop.set(key, y);
        }
      });
    };

    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--mobile-nav-h",
      `${compact ? MOBILE_NAV_COMPACT_HEIGHT : MOBILE_NAV_HEIGHT}px`
    );
  }, [compact]);
  useEffect(
    () => () => {
      document.documentElement.style.removeProperty("--mobile-nav-h");
    },
    []
  );

  return compact;
}

const MobileNavContainer = styled("nav")(({ theme }) => {
  const dark = theme.palette.mode === "dark";
  return {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-around",
    padding: "4px 8px",
    paddingBottom: "calc(4px + env(safe-area-inset-bottom, 0px))",
    minHeight: `var(--mobile-nav-h, ${MOBILE_NAV_HEIGHT}px)`,
    boxSizing: "content-box",
    transition: `min-height 0.35s ${EASE}, padding 0.35s ${EASE}, box-shadow 0.35s ease`,
    '&[data-compact="true"]': {
      paddingTop: 2,
      paddingBottom: "calc(2px + env(safe-area-inset-bottom, 0px))",
    },
    "@media (prefers-reduced-motion: reduce)": { transition: "none" },
    backgroundColor: dark ? "rgba(18, 15, 28, 0.96)" : "rgba(255, 255, 255, 0.97)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    borderTop: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(15, 12, 30, 0.08)"}`,
    borderRadius: "22px 22px 0 0",
    boxShadow: dark ? "0 -10px 32px rgba(0,0,0,0.5)" : "0 -8px 32px rgba(20, 10, 60, 0.10)",
    // Tablets: a centred floating bar instead of edge-to-edge
    [theme.breakpoints.up("sm")]: {
      left: "50%",
      right: "auto",
      transform: "translateX(-50%)",
      width: "min(560px, calc(100vw - 32px))",
      bottom: 12,
      paddingBottom: 4,
      borderRadius: 26,
      '&[data-compact="true"]': { paddingBottom: 2 },
      border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(15, 12, 30, 0.08)"}`,
    },
  };
});

const MobileNavItem = styled(Link)(({ theme }) => {
  const dark = theme.palette.mode === "dark";
  return {
    flex: "1 1 0",
    minWidth: 0,
    minHeight: `calc(var(--mobile-nav-h, ${MOBILE_NAV_HEIGHT}px) - 8px)`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    textDecoration: "none",
    position: "relative",
    color: dark ? "rgba(255,255,255,0.62)" : "rgba(15, 12, 30, 0.6)",
    WebkitTapHighlightColor: "transparent",
    transition: "color 0.2s ease, transform 0.15s ease",
    "&:active": { transform: "scale(0.94)" },
    // Icon sits in a pill that fills in when the tab is active
    "& .icon-wrap": {
      width: 56,
      height: 30,
      borderRadius: 15,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.25s ease, transform 0.25s ease",
    },
    "& .icon-wrap .MuiSvgIcon-root": { fontSize: "1.55rem", transition: `font-size 0.3s ${EASE}` },
    "& .label": {
      maxHeight: 16,
      transition: `opacity 0.2s ease, max-height 0.3s ${EASE}, margin 0.3s ${EASE}`,
      fontSize: "0.7rem",
      fontWeight: 600,
      lineHeight: 1.1,
      letterSpacing: 0.1,
      whiteSpace: "nowrap",
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    // Compact (scrolling down): icons only, tighter pill
    '[data-compact="true"] &': {
      gap: 0,
      "& .icon-wrap": { width: 44, height: 26 },
      "& .icon-wrap .MuiSvgIcon-root": { fontSize: "1.3rem" },
      "& .label": { opacity: 0, maxHeight: 0, margin: 0 },
    },
    "&.active": { color: dark ? "#fff" : COLORS.PRIMARY_PURPLE },
    "&.active .label": { fontWeight: 800 },
    "&.active .icon-wrap": {
      backgroundColor: dark ? "rgba(130, 72, 247, 0.28)" : COLORS.PURPLE_ALPHA_10,
      transform: "translateY(-1px)",
    },
    // Uber-style top indicator on the active tab
    "&.active::before": {
      content: '""',
      position: "absolute",
      top: -6,
      left: "50%",
      width: 28,
      height: 3,
      borderRadius: "0 0 3px 3px",
      transform: "translateX(-50%)",
      backgroundColor: COLORS.PRIMARY_PURPLE,
    },
    "@media (prefers-reduced-motion: reduce)": {
      transition: "none",
      "&:active": { transform: "none" },
      "& .icon-wrap": { transition: "none" },
      "& .icon-wrap .MuiSvgIcon-root": { transition: "none" },
      "& .label": { transition: "none" },
    },
  };
});

interface MobileBottomNavProps {
  items: NavItem[];
  currentPath: string;
}

const isActivePath = (currentPath: string, href: string) =>
  href === "/" ? currentPath === "/" : currentPath === href || currentPath.startsWith(`${href}/`);

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ items, currentPath }) => {
  const dark = useTheme().palette.mode === "dark";
  const compact = useCompactOnScrollDown();
  return (
    <MobileNavContainer aria-label="Primary" data-compact={compact ? "true" : "false"}>
      {items.map((item) => {
        const isActive = isActivePath(currentPath, item.href);
        return (
          <MobileNavItem
            key={item.label}
            href={item.href}
            className={isActive ? "active" : ""}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
          >
            <Box className="icon-wrap">
              {isActive && !dark ? (
                <GradientIcon sx={{ fontSize: "1.55rem" }}>{item.icon}</GradientIcon>
              ) : isActive ? (
                // The brand gradient is too dark on the dark pill: use a light tint instead
                React.cloneElement(item.icon as React.ReactElement<{ sx?: object }>, {
                  sx: { fontSize: "1.55rem", color: "#d2bcff" },
                })
              ) : (
                React.cloneElement(item.icon as React.ReactElement<{ sx?: object }>, {
                  sx: { fontSize: "1.55rem" },
                })
              )}
            </Box>
            <Box component="span" className="label">
              {item.label}
            </Box>
          </MobileNavItem>
        );
      })}
    </MobileNavContainer>
  );
};

export default MobileBottomNav;
