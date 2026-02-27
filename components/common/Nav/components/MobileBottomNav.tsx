import React from "react";
import { Box, styled } from "@mui/material";
import Link from "next/link";
import { COLORS } from "../../../../constants/colors";
import GradientIcon from "../../GradientIcon";
import { NavItem } from "../../../../constants/navRoutes";

const MobileNavContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  backgroundColor:
    theme.palette.mode === "dark"
      ? COLORS.BACKGROUND.PAPER_DARK
      : COLORS.BACKGROUND.PAPER_LIGHT,
  width: "100%",
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  padding: "0.75rem 0",
  boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
  borderTop: `1px solid ${theme.palette.mode === "dark"
      ? COLORS.BORDER.DEFAULT_DARK
      : COLORS.BORDER.DEFAULT_LIGHT
    }`,
}));

const MobileNavItem = styled(Link)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.25rem",
  textDecoration: "none",
  color:
    theme.palette.mode === "dark"
      ? COLORS.TEXT.SECONDARY_DARK
      : COLORS.TEXT.SECONDARY_LIGHT,
  transition: "all 0.2s ease",
  "&.active": {
    color: COLORS.PRIMARY_PURPLE,
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.5rem",
    marginBottom: "2px",
  },
  "& span": {
    fontSize: "0.7rem",
    fontWeight: 500,
  },
}));

interface MobileBottomNavProps {
  items: NavItem[];
  currentPath: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  items,
  currentPath,
}) => {
  return (
    <MobileNavContainer>
      {items.map((item) => (
        <MobileNavItem
          key={item.label}
          href={item.href}
          className={currentPath === item.href ? "active" : ""}
        >
          {currentPath === item.href ? (
            <GradientIcon>{item.icon}</GradientIcon>
          ) : (
            item.icon
          )}
          {item.label}
        </MobileNavItem>
      ))}
    </MobileNavContainer>
  );
};

export default MobileBottomNav;
