import React from "react";
import { Box, styled } from "@mui/material";
import Image from "next/image";
import { COLORS } from "../../../../constants/colors";

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  cursor: "pointer",
});

interface ExternalLogoProps {
  mode: "light" | "dark";
}

const ExternalLogo: React.FC<ExternalLogoProps> = ({ mode }) => {
  return (
    <LogoContainer>
      <Image
        src="/logo.svg"
        alt="kartsquare Logo"
        width={44}
        height={44}
        priority
      />
      <Box
        component="span"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "1.15rem", md: "1.35rem" },
          letterSpacing: "0.2px",
          color:
            mode === "dark"
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
        }}
      >
        kartsquare
      </Box>
    </LogoContainer>
  );
};

export default ExternalLogo;
