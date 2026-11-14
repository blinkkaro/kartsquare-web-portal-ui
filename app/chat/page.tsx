import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CHAT_ENABLED } from "@/lib/featureFlags";
import MainLayout from "../mainLayout";
import ChatView from "@/components/pages/chat";
import { seoPrivate } from "@/lib/seo/buildMetadata";

export const metadata = seoPrivate({
  title: "Messages",
  description:
    "Chat with customers, suppliers, and service providers on kartsquare in one secure inbox.",
});

export default function ChatPage() {
  if (!CHAT_ENABLED) notFound();
  return (
    <MainLayout>
      <Suspense>
        <ChatView />
      </Suspense>
    </MainLayout>
  );
}
