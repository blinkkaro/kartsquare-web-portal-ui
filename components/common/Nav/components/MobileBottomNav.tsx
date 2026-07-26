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
      ? "rgba(17, 24, 39, 0.85)"
      : "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(12px)",
  width: "92%",
  position: "fixed",
  // 16px base clearance, plus the device's home-indicator inset (0 on non-notched
  // devices, so this degrades to the old fixed 16px there).
  bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
  left: "4%",
  right: "4%",
  zIndex: 1000,
  padding: "0.5rem 0",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  border: `1px solid ${theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.05)"
    }`,
}));

const MobileNavItem = styled(Link)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "2px",
  textDecoration: "none",
  color:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.5)"
      : "rgba(0,0,0,0.5)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  flex: 1,
  position: "relative",
  "&.active": {
    color: COLORS.PRIMARY_PURPLE,
    transform: "translateY(-2px)",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.25rem",
    transition: "transform 0.3s ease",
  },
  "&.active .MuiSvgIcon-root": {
    transform: "scale(1.1)",
  },
  "& .label": {
    fontSize: "0.6rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.02em",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-4px",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    backgroundColor: COLORS.PRIMARY_PURPLE,
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&.active::after": {
    opacity: 1,
  }
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
