import React from "react";
import { Box, styled } from "@mui/material";
import Link from "next/link";
import { COLORS } from "../../../../constants/colors";
import { NavItem } from "../../../../constants/navRoutes";

const NavLinksContainer = styled(Box)(({ theme }) => ({
  display: "none",
  gap: "2rem",
  alignItems: "center",
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const NavLink = styled(Link)(({ theme }) => ({
  color:
    theme.palette.mode === "dark"
      ? COLORS.TEXT.SECONDARY_DARK
      : COLORS.TEXT.SECONDARY_LIGHT,
  textDecoration: "none",
  fontSize: "0.875rem",
  fontWeight: 500,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  padding: "0.4rem 0.75rem",
  borderRadius: "8px",
}));

interface DesktopNavLinksProps {
  items: NavItem[];
  currentPath: string;
  mode: "light" | "dark";
}

const DesktopNavLinks: React.FC<DesktopNavLinksProps> = ({
  items,
  currentPath,
  mode,
}) => {
  const isDark = mode === "dark";
  return (
    <NavLinksContainer>
      {items.map((item) => (
        <NavLink
          key={item.label}
          href={item.href}
          className={currentPath === item.href ? "active" : ""}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color:
              currentPath === item.href
                ? isDark
                  ? COLORS.ACCENT_BLUE_DARK
                  : COLORS.PRIMARY_PURPLE
                : isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
            fontWeight: currentPath === item.href ? 600 : 500,
            backgroundColor:
              currentPath === item.href
                ? isDark
                  ? "rgba(100, 181, 246, 0.08)"
                  : "rgba(106, 27, 154, 0.06)"
                : "transparent",
            "&:hover": {
              color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
              backgroundColor: isDark
                ? "rgba(100, 181, 246, 0.12)"
                : "rgba(106, 27, 154, 0.08)",
              transform: "translateY(-2px)",
            },
          }}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </NavLinksContainer>
  );
};

export default DesktopNavLinks;
