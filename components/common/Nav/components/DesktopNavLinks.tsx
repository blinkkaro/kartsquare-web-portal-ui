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
  "&:hover": {
    color: COLORS.PRIMARY_PURPLE,
  },
  "&.active": {
    color: COLORS.PRIMARY_PURPLE,
    fontWeight: 600,
  },
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
                ? COLORS.PRIMARY_PURPLE
                : mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {item.label}
        </NavLink>
      ))}
    </NavLinksContainer>
  );
};

export default DesktopNavLinks;
