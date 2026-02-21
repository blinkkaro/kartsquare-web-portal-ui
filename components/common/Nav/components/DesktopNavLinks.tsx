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
  transition: "color 0.2s ease-in-out",
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
            "&:hover": {
              color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
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
