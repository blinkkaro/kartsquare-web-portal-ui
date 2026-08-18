import DeleteAccountView from "@/components/pages/DeleteAccount";
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata = seoAuth({
  title: "Delete Account | kartsquare",
  description: "Permanently delete your kartsquare account.",
});


export default function DeleteAccount() {
  return <DeleteAccountView />;
}
