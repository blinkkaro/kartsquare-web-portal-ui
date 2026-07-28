import { Suspense } from "react";
import MainLayout from "../mainLayout";
import ChatView from "@/components/pages/chat";
import { seoPrivate } from "@/lib/seo/buildMetadata";

export const metadata = seoPrivate({
  title: "Messages",
  description:
    "Chat with customers, suppliers, and service providers on KartSquare in one secure inbox.",
});

export default function ChatPage() {
  return (
    <MainLayout>
      <Suspense>
        <ChatView />
      </Suspense>
    </MainLayout>
  );
}
