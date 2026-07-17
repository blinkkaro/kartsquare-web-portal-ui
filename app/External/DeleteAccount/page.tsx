import DeleteAccountView from "@/components/pages/DeleteAccount";
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata = seoAuth({
  title: "Delete Account | KartSquare",
  description: "Permanently delete your KartSquare account.",
});


export default function DeleteAccount() {
  return <DeleteAccountView />;
}
