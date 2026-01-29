import React from "react";
import BusinessInfoView from "@/components/pages/businessInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Business Info | kartsquare Portal",
    description: "Business Info to register your business",
}

function BusinessInfo() {
  return <BusinessInfoView />;
}

export default BusinessInfo;
