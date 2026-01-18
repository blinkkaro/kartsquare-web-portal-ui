import React from "react";
import { Box, Typography, Card, CardMedia, IconButton } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Image from "next/image";

interface DocumentCardProps {
  image: string;
  fileName: string;
  label?: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  image,
  fileName,
  label,
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      {label && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {label}
        </Typography>
      )}
      <Card
        sx={{
          borderRadius: "16px",
          boxShadow: "none",
          border: "none",
          backgroundColor: "background.paper", // Or 'white' depending on theme, using paper for now
          p: 1.5,
        }}
      >
        <Box
          sx={{
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            mb: 1.5,
            height: 180,
          }}
        >
          {/* Using CardMedia for simplicity with external URLs, or Next Image with fill */}
          <CardMedia
            component="img"
            image={image}
            alt={fileName}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 0.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: "500", fontSize: "0.85rem" }}
          >
            {fileName}
          </Typography>
          <IconButton size="small" aria-label="download">
            <FileDownloadOutlinedIcon
              sx={{ fontSize: "1.2rem", color: "primary.main" }}
            />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
};

export default DocumentCard;
