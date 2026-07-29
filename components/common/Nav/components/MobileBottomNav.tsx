import React from "react";
import { Box, styled } from "@mui/material";
import Link from "next/link";
import { COLORS } from "../../../../constants/colors";
import GradientIcon from "../../GradientIcon";
import { NavItem } from "../../../../constants/navRoutes";

const MobileNavContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "2px",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(23, 20, 34, 0.9)"
      : "rgba(255, 255, 255, 0.92)",
  backdropFilter: "blur(16px) saturate(180%)",
  WebkitBackdropFilter: "blur(16px) saturate(180%)",
  position: "fixed",
  bottom: "14px",
  left: "50%",
  width: "calc(min(94vw, 440px) - 60px)",
  transform: "translateX(calc(min(94vw, 440px) * -0.5))",
  zIndex: 1000,
  padding: "4px",
  borderRadius: "22px",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 10px 30px rgba(0,0,0,0.45)"
      : "0 10px 30px rgba(94, 24, 233, 0.14)",
  border: `1px solid ${theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(94, 24, 233, 0.06)"
    }`,
}));

const MobileNavItem = styled(Link)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1px",
  textDecoration: "none",
  color:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.5)"
      : "rgba(0,0,0,0.45)",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  flex: 1,
  minWidth: 0,
  padding: "6px 2px",
  position: "relative",
  borderRadius: "14px",
  "&.active": {
    color: COLORS.PRIMARY_PURPLE,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(130, 72, 247, 0.16)"
        : COLORS.PURPLE_ALPHA_10,
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.25rem",
    transition: "transform 0.25s ease",
  },
  "&.active .MuiSvgIcon-root": {
    transform: "scale(1.08)",
  },
  "& .label": {
    fontSize: "0.58rem",
    fontWeight: 600,
    lineHeight: 1,
    whiteSpace: "nowrap",
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
      {items.map((item) => {
        const isActive = currentPath === item.href;
        return (
          <MobileNavItem
            key={item.label}
            href={item.href}
            className={isActive ? "active" : ""}
            aria-label={item.label}
          >
            {isActive ? (
              <GradientIcon sx={{ fontSize: "1.25rem" }}>{item.icon}</GradientIcon>
            ) : (
              React.cloneElement(item.icon as any, { sx: { fontSize: "1.25rem" } })
            )}
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
