import React from "react";
import type { Metadata } from "next";
import SelectRole from "@/components/pages/selectRole";

export const metadata: Metadata = {
  title: "Select Role | KartSquare Portal",
  description: "Select your role",
};

export default function page() {
  return <SelectRole />;
}
