"use client";
import { useMemo, useState } from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import { blogs } from "../../../data/blogs";
import CategoryFilter from "./components/CategoryFilter";
import BlogCard from "../blog/components/BlogCard";
import { useTranslate } from "@/hooks/useTranslate";

const BlogView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { t } = useTranslate();

  const categories = useMemo(() => {
    return [
      t("general"),
      t("cleaning"),
      t("repairs"),
      t("education"),
      t("wellness"),
    ];
  }, [t]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch = blog.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory
        ? blog.category === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        {t("blogs")}
      </Typography>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      <Grid container spacing={4}>
        {filteredBlogs.map((blog) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={blog.id}>
            <BlogCard
              id={blog.id}
              image={blog.coverImage}
              date={blog.date}
              title={blog.title}
              description={blog.description}
            />
          </Grid>
        ))}
      </Grid>

      {filteredBlogs.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {t("noBlogsFound")}
          </Typography>
        </Box>
      )}
    </Container>
  );
};
export default BlogView;
