"use client";

import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import { freeListingData } from "@/data/freeListingData";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const SuccessStories = () => {
  return (
    <Box sx={{ py: 10, bgcolor: COLORS.BACKGROUND.PAPER_LIGHT }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            mb: 1,
            fontWeight: 700,
            color: COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          Success Stories
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 6,
            fontWeight: 400,
            color: COLORS.TEXT.SECONDARY_LIGHT,
          }}
        >
          6.1 Lakh+ Advertisers
        </Typography>

        <Grid container spacing={4}>
          {freeListingData.successStories.map((story, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: 250, // Increased height for better visibility
                    overflow: "hidden",
                  }}
                >
                  {/* Explicitly using Box type="img" (component="img") as requested */}
                  <Box
                    component="img"
                    src={story.image}
                    alt={story.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                      "&:hover": {
                        transform: "scale(1.05)", // Subtle zoom on hover
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      bgcolor: "white",
                      borderRadius: "50%",
                      display: "flex",
                      p: 0.5,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    <PlayCircleOutlineIcon
                      color="primary"
                      sx={{ fontSize: 40 }}
                    />
                  </Box>
                </Box>
                <CardContent sx={{ bgcolor: "#E3F2FD" }}>
                  {" "}
                  {/* Light blue bg derived from image */}
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: 600 }}
                  >
                    {story.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {story.business}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    {story.location}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Button variant="contained" color="primary">
            See All Stories
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
import Button from "@/components/common/Button";

export default SuccessStories;
