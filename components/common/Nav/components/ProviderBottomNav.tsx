import React, { useState } from "react";
import Link from "next/link";
import { alpha, Box, ButtonBase, Drawer, styled, Typography } from "@mui/material";
import { useReducedMotion } from "framer-motion";
import { COLORS } from "@/constants/colors";
import { type NavItem, type ProviderDockItem, ProviderMoreIcon } from "@/constants/navRoutes";
import { useTranslate } from "@/hooks/useTranslate";
import { isActivePath, MOBILE_NAV_HEIGHT, usePublishHeight } from "./MobileBottomNav";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Floating dock, same footprint as the customer dock, on the brand violet. */
const Dock = styled("nav")({
  position: "fixed",
  left: 12,
  right: 12,
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
  background: `linear-gradient(135deg, ${COLORS.PURPLE_DEEP} 0%, ${COLORS.PRIMARY_PURPLE} 100%)`,
  boxShadow: `0 12px 28px ${alpha(COLORS.PURPLE_DEEP, 0.45)}`,
});

const tabStyles = {
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
  color: alpha(COLORS.WHITE, 0.78),
  WebkitTapHighlightColor: "transparent",
  transition: "color 200ms ease-out, transform 120ms ease-out",
  "&:active": { transform: "scale(0.93)" },
  "&:focus-visible": { outline: `3px solid ${COLORS.WHITE}`, outlineOffset: 1 },
  "& .pill": {
    width: 48,
    height: 26,
    borderRadius: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    transform: "scaleX(0.7)",
    transition: `background-color 220ms ease-out, transform 320ms ${EASE}`,
  },
  "& .pill .icon": {
    display: "inline-flex",
    transform: "scaleX(1.4286)",
    transition: `transform 320ms ${EASE}`,
  },
  "& .label": {
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: 1.1,
  },
  "&.open": { color: COLORS.WHITE },
  "&.open .pill": { backgroundColor: alpha(COLORS.WHITE, 0.22), transform: "scaleX(1)" },
  "&.open .pill .icon": { transform: "scaleX(1)" },
  "&.open .label": { fontWeight: 700 },
  // The accent tab: always a filled orange disc, so the main destination is unmistakable.
  "&.emphasis .pill": {
    width: 40,
    height: 40,
    borderRadius: "50%",
    transform: "none",
    backgroundColor: COLORS.SECONDARY_ORANGE,
    color: COLORS.WHITE,
    marginTop: -10,
    boxShadow: `0 6px 14px ${alpha(COLORS.SECONDARY_ORANGE, 0.55)}`,
  },
  "&.emphasis .pill .icon": { transform: "none" },
  "&.emphasis .label": { color: COLORS.WHITE, fontWeight: 700 },
  // The lamp on the dock's top edge marks the open tab.
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
    backgroundColor: COLORS.SECONDARY_ORANGE,
    boxShadow: `0 4px 14px 2px ${alpha(COLORS.SECONDARY_ORANGE, 0.5)}`,
    transition: `opacity 220ms ease-out, transform 320ms ${EASE}`,
  },
  "&.open::before": { opacity: 1, transform: "translateX(-50%) scaleX(1)" },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    "&:active": { transform: "none" },
    "& .pill, & .pill .icon, &::before": { transition: "none" },
  },
} as const;

const TabLink = styled(Link)(tabStyles);
const TabButton = styled("button")({
  ...tabStyles,
  border: 0,
  background: "none",
  font: "inherit",
  cursor: "pointer",
  padding: 0,
});

interface ProviderBottomNavProps {
  primary: ProviderDockItem[];
  more: NavItem[];
  currentPath: string;
}

const TabInner: React.FC<{ item: Pick<NavItem, "label" | "icon"> }> = ({ item }) => (
  <>
    <Box component="span" className="pill">
      <Box component="span" className="icon">
        {item.icon &&
          React.cloneElement(item.icon as React.ReactElement<{ sx?: object }>, {
            sx: { fontSize: "1.4rem" },
          })}
      </Box>
    </Box>
    <Box component="span" className="label">
      {item.label}
    </Box>
  </>
);

const ProviderBottomNav: React.FC<ProviderBottomNavProps> = ({ primary, more, currentPath }) => {
  const { t } = useTranslate();
  const reduce = useReducedMotion() === true;
  // The sheet remembers the path it was opened on, so moving to another page closes it by itself.
  const [sheetPath, setSheetPath] = useState<string | null>(null);
  const sheetOpen = sheetPath === currentPath;
  const setSheetOpen = (open: boolean) => setSheetPath(open ? currentPath : null);
  usePublishHeight();

  const activeHref = primary.find((i) => isActivePath(currentPath, i.href))?.href ?? null;
  const moreActive = !activeHref && more.some((i) => isActivePath(currentPath, i.href));
  const tick = () => {
    if (!reduce && typeof navigator !== "undefined") navigator.vibrate?.(8);
  };

  return (
    <>
      <Dock aria-label="Provider" data-native-hide>
        {primary.map((item) => (
          <TabLink
            key={item.href}
            href={item.href}
            className={[item.href === activeHref ? "open" : "", item.emphasis ? "emphasis" : ""]
              .join(" ")
              .trim()}
            aria-label={item.label}
            aria-current={item.href === activeHref ? "page" : undefined}
            onClick={tick}
          >
            <TabInner item={item} />
          </TabLink>
        ))}
        <TabButton
          type="button"
          className={moreActive || sheetOpen ? "open" : ""}
          aria-label={t("pd_nav_more")}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          onClick={() => {
            tick();
            setSheetOpen(true);
          }}
        >
          <TabInner item={{ label: t("pd_nav_more"), icon: <ProviderMoreIcon /> }} />
        </TabButton>
      </Dock>

      <Drawer
        anchor="bottom"
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              pb: "calc(16px + env(safe-area-inset-bottom, 0px))",
              maxWidth: 520,
              mx: "auto",
            },
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}
          >
            <Typography variant="h6" component="h2">
              {t("pd_nav_more")}
            </Typography>
            <ButtonBase
              onClick={() => setSheetOpen(false)}
              aria-label={t("pd_nav_close")}
              sx={{
                minWidth: 44,
                minHeight: 44,
                borderRadius: "12px",
                fontWeight: 600,
                color: COLORS.PRIMARY_PURPLE,
                px: 1.5,
              }}
            >
              {t("pd_nav_close")}
            </ButtonBase>
          </Box>
          <Box
            component="ul"
            sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1 }}
          >
            {more.map((item) => {
              const active = isActivePath(currentPath, item.href);
              return (
                <li key={item.href}>
                  <ButtonBase
                    component={Link}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 2,
                      minHeight: 56,
                      px: 2,
                      borderRadius: "12px",
                      fontWeight: active ? 700 : 600,
                      color: active ? COLORS.PRIMARY_PURPLE : COLORS.TEXT.PRIMARY_LIGHT,
                      bgcolor: active ? COLORS.PURPLE_ALPHA_10 : "transparent",
                      "&:hover": { bgcolor: COLORS.NEW_UI.SURFACE_SOFT_LIGHT },
                      "&.Mui-focusVisible": {
                        outline: `3px solid ${COLORS.PRIMARY_PURPLE}`,
                        outlineOffset: 2,
                      },
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </ButtonBase>
                </li>
              );
            })}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default ProviderBottomNav;
