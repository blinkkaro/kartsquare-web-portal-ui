import React from "react";
import { Box, styled } from "@mui/material";
import Image from "next/image";
import { COLORS } from "../../../../constants/colors";

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  cursor: "pointer",
});

interface NavLogoProps {
  isMobile: boolean;
  mode: "light" | "dark";
}

const NavLogo: React.FC<NavLogoProps> = ({ isMobile, mode }) => {
  return (
    <LogoContainer>
      <Image
        src="/logo.svg"
        alt="Octopus Logo"
        width={isMobile ? 28 : 32}
        height={isMobile ? 28 : 32}
        priority
      />
      <Box
        component="span"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "1rem", md: "1.125rem" },
          color:
            mode === "dark"
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
        }}
      >
        KartSquare
      </Box>
    </LogoContainer>
  );
};

export default NavLogo;
