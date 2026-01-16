import VerifyDocumentsView from "@/components/pages/verifyDocuments";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Documents | KartSquare Portal",
  description: "Upload and verify your documents",
};

export default function VerifyDocuments() {
  return <VerifyDocumentsView />;
}
