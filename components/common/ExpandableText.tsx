import React, { useState } from "react";
import { Typography, Box, SxProps, Theme } from "@mui/material";
import { COLORS } from "@/constants/colors";

interface ExpandableTextProps {
  text: string;
  maxChars?: number;
  sx?: SxProps<Theme>;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ 
  text, 
  maxChars = 100, 
  sx = {} 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > maxChars;

  if (!shouldTruncate) {
    return (
      <Typography variant="body2" sx={sx}>
        {text}
      </Typography>
    );
  }

  const displayText = isExpanded ? text : `${text.slice(0, maxChars)}`;

  return (
    <Typography variant="body2" sx={sx}>
      {displayText}
      {!isExpanded && "..."}
      <Box
        component="span"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        sx={{
          color: COLORS.ACCENT_BLUE_DARK,
          cursor: "pointer",
          fontWeight: 700,
          ml: 0.5,
          "&:hover": { textDecoration: "underline" },
        }}
      >
        {isExpanded ? " less" : " more"}
      </Box>
    </Typography>
  );
};

export default ExpandableText;
