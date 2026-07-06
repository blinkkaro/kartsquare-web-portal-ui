import { redirect } from "next/navigation";

export default function DeleteAccountRedirect() {
  redirect("/delete-account");
}
