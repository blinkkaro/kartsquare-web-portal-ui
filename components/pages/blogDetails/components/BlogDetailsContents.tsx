import { Container, Typography, Box, Avatar } from "@mui/material";

const BlogDetailsContent: React.FC<{ blog: any }> = ({ blog }) => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ position: "relative", mb: 4 }}>
        <img
          src={blog.coverImage}
          alt={blog.title}
          style={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            p: 3,
            borderRadius: "0 0 8px 8px",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            {blog.title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ width: 32, height: 32 }}>{blog.author[0]}</Avatar>
            <Typography variant="body2">
              By {blog.author} • {new Date(blog.date).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          typography: "body1",
          lineHeight: 1.8,
          "& ul, & ol": {
            paddingLeft: "24px",
            marginBottom: "16px",
          },
          "& li": {
            marginBottom: "8px",
          },
          "& p": {
            marginBottom: "16px",
          },
          "& h1, & h2, & h3, & h4, & h5, & h6": {
            marginTop: "24px",
            marginBottom: "12px",
          },
          "& blockquote": {
            borderLeft: "4px solid #ccc",
            paddingLeft: "16px",
            margin: "16px 0",
            fontStyle: "italic",
          },
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </Box>
    </Container>
  );
};
export default BlogDetailsContent;
