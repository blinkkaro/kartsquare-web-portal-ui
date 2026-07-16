<<<<<<< HEAD
import DeleteAccountView from "@/components/pages/DeleteAccount";
=======
import DeleteAccountView from "@/components/pages/deleteAccount";
>>>>>>> e9347cbdeae59e89bf4bcdecc623770407899d5e
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata = seoAuth({
  title: "Delete Account | KartSquare",
  description: "Permanently delete your KartSquare account.",
});

<<<<<<< HEAD

=======
>>>>>>> e9347cbdeae59e89bf4bcdecc623770407899d5e
export default function DeleteAccount() {
  return <DeleteAccountView />;
}
