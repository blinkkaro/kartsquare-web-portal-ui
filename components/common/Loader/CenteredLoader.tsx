"use client";

import React from "react";
import { Box, BoxProps } from "@mui/material";
import LogoLoader from "./LogoLoader";

interface CenteredLoaderProps extends BoxProps {
  size?: number;
  showText?: boolean;
}

const CenteredLoader: React.FC<CenteredLoaderProps> = ({ 
  size = 60, 
  showText,
  ...props 
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 8,
        width: "100%",
        ...props.sx,
      }}
      {...props}
    >
      <LogoLoader size={size} showText={showText} />
    </Box>
  );
};

export default CenteredLoader;
