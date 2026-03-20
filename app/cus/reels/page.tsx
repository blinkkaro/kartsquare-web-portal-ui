import React from "react";
import { Metadata } from "next";
import ReelsView from "@/components/pages/reels";

export const metadata: Metadata = {
    title: "Reels | kartsquare Portal",
}

function ReelsPage() {
    return <ReelsView />
}

export default ReelsPage;
