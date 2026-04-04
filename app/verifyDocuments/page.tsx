import VerifyDocumentsView from "@/components/pages/verifyDocuments";
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata = seoAuth({
  title: "Verify documents",
  description:
    "Upload identity and business documents for KartSquare verification so customers can trust your profile.",
});

export default function VerifyDocuments() {
  return <VerifyDocumentsView />;
}
