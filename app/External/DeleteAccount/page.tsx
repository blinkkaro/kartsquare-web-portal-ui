import DeleteAccountView from "@/components/pages/DeleteAccount";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Delete Account | KartSquare",
  description: "Permanently delete your KartSquare account.",
  path: "/External/DeleteAccount",
});

export default function DeleteAccount() {
  return <DeleteAccountView />;
}
