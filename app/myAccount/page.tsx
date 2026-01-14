"use client";
import MyAccountView from "@/components/pages/myAccount";
import React from "react";
import MainLayout from "../mainLayout";

function page() {
  return (
    <MainLayout>
      <MyAccountView />
    </MainLayout>
  );
}

export default page;
