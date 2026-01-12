import React from "react";
import { Box, Avatar, Typography, Stack, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";

const stories = [
  { id: 1, name: "Umm Kulthum", image: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Habib Asfa", image: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Jaziri Hajjar", image: "https://i.pravatar.cc/150?u=3" },
  { id: 4, name: "Iesha Malon", image: "https://i.pravatar.cc/150?u=4" },
  { id: 5, name: "Qamraaa e...", image: "https://i.pravatar.cc/150?u=5" },
  { id: 6, name: "Haamida a...", image: "https://i.pravatar.cc/150?u=6" },
  { id: 7, name: "Jiyaad al-...", image: "https://i.pravatar.cc/150?u=7" },
];

const StoriesSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        p: 2,
        bgcolor:
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.PRIMARY_LIGHT,
        borderRadius: 2,
        boxShadow: COLORS.SHADOW.LIGHT,
        border: `1px solid ${COLORS.BORDER.DEFAULT_LIGHT}`,
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
      }}
    >
      {stories.map((story, index) => (
        <Stack
          key={story.id}
          alignItems="center"
          spacing={1}
          sx={{ minWidth: 64 }}
        >
          <Box
            sx={{
              p: 0.3,
              borderRadius: "50%",
              border: `2px solid ${
                index === 0 ? "transparent" : COLORS.PRIMARY_PURPLE
              }`, // Example active ring
            }}
          >
            <Avatar
              src={story.image}
              alt={story.name}
              sx={{
                width: 56,
                height: 56,
                border: `2px solid ${theme.palette.background.paper}`,
              }}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.7rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
              color: theme.palette.text.primary,
            }}
          >
            {story.name}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
};

export default StoriesSection;
