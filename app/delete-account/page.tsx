import MainLayout from "@/app/mainLayout";
import DeleteAccountView from "@/components/pages/deleteAccount";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Delete Account",
  description:
    "Request deletion of your KartSquare account and associated personal data.",
  path: "/delete-account",
});

export default function DeleteAccount() {
  return (
    <MainLayout>
      <DeleteAccountView />
    </MainLayout>
  );
}

