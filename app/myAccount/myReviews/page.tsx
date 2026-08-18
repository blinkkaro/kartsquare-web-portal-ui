import MainLayout from "@/app/mainLayout";
import MyReviewView from "@/components/pages/myReview";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "My reviews",
  "See feedback from customers and manage your reputation on kartsquare.",
);

export default function MyReviews() {
  return (
    <MainLayout>
      <MyReviewView />
    </MainLayout>
  );
}
