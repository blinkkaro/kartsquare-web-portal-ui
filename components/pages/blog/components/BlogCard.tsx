import React, { use } from "react";
import { Box, Typography, Card, CardContent, CardMedia } from "@mui/material";
import { useRouter } from "next/navigation";

interface BlogCardProps {
  id: string;
  image: string;
  date: string;
  title: string;
  description: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  image,
  date,
  title,
  description,
}) => {
  const router = useRouter();
  return (
    <Card
      onClick={() => { router.push("/blogs/" + id) }}
      sx={{
        borderRadius: "16px",
        boxShadow: "none",
        border: "none",
        backgroundColor: "transparent",
        maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          mb: 2,
        }}
      >
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={title}
          sx={{ objectFit: "cover" }}
        />
      </Box>

      <CardContent sx={{ px: 0, py: 0, flexGrow: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0.5, fontSize: "0.7rem" }}
        >
          {date}
        </Typography>
        <Typography
          gutterBottom
          variant="subtitle1"
          component="div"
          sx={{ fontWeight: "bold", lineHeight: 1.2, mb: 0.5 }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            // WebkitLineClamp: 2,
            fontSize: "0.8rem",
            // lineHeight: 1.4,
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
