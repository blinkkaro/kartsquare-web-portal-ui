import MainLayout from "@/app/mainLayout";
import ManageProductView from "@/components/pages/manageProduct";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "Manage product",
  "Create or edit product listings, pricing, images, and inventory for your KartSquare store.",
);

export default async function ManageProduct({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;
  return (
    <MainLayout>
      <ManageProductView productId={id} />
    </MainLayout>
  );
}
