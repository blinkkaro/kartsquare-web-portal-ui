import MainLayout from "@/app/mainLayout";
import BlogView from "@/components/pages/blog";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "My blog",
  "Create and manage blog posts linked to your kartsquare professional profile.",
);

export default function Blog() {
  return (
    <MainLayout>
      <BlogView />
    </MainLayout>
  );
}
