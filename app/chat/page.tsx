import { Metadata } from "next";
import ChatView from "@/components/pages/chat";
import MainLayout from "../mainLayout";

export const metadata: Metadata = {
    title: "Chat & Messages | KartSquare",
    description: "Manage your conversations and stay connected with buyers and sellers on KartSquare.",
};

export default function ChatPage() {
    return (
        <MainLayout>
            <ChatView />
        </MainLayout>
    );
}
